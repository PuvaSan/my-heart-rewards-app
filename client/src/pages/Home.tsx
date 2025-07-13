import { useState, useEffect, useRef } from "react";
import { Task, Reward, AppState, ActivityEntry, Purchase } from "@/lib/types";
import { loadAppState, saveAppState, generateId } from "@/lib/storage";
import { getCurrencySymbol } from "@/components/CurrencySelector";
import HeartCounter from "@/components/HeartCounter";
import MoneyCounter from "@/components/MoneyCounter";
import TaskForm from "@/components/TaskForm";
import TasksList from "@/components/TasksList";
import RewardForm from "@/components/RewardForm";
import RewardsList from "@/components/RewardsList";
import SpendingForm from "@/components/SpendingForm";
import PurchaseHistory from "@/components/PurchaseHistory";
import ParentGateModal from "@/components/ParentGateModal";
import SuccessOverlay from "@/components/SuccessOverlay";
import FloatingAnimation from "@/components/FloatingAnimation";
import ConfettiEffect from "@/components/ConfettiEffect";
import ActivityHistoryModal from "@/components/ActivityHistoryModal";

export default function Home() {
  const [appState, setAppState] = useState<AppState>({
    childName: "",
    currency: "YEN",
    hearts: 0,
    money: 0,
    tasks: [],
    rewards: [],
    claimedRewards: [],
    activityHistory: [],
    purchases: [],
  });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [showSpendingForm, setShowSpendingForm] = useState(false);
  const [showActivityHistory, setShowActivityHistory] = useState(false);
  const [parentGateModal, setParentGateModal] = useState<{
    isOpen: boolean;
    reward: Reward | null;
  }>({
    isOpen: false,
    reward: null,
  });
  const [successOverlay, setSuccessOverlay] = useState<{
    isVisible: boolean;
    message: string;
    subMessage?: string;
  }>({
    isVisible: false,
    message: "",
    subMessage: "",
  });
  const [floatingAnimation, setFloatingAnimation] = useState<{
    isVisible: boolean;
    startPosition: { x: number; y: number };
    targetPosition: { x: number; y: number };
    content: React.ReactNode;
  }>({
    isVisible: false,
    startPosition: { x: 0, y: 0 },
    targetPosition: { x: 0, y: 0 },
    content: null,
  });
  const [showConfetti, setShowConfetti] = useState(false);

  const heartCounterRef = useRef<HTMLDivElement>(null);
  const moneyCounterRef = useRef<HTMLDivElement>(null);

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedState = loadAppState();
    setAppState(savedState);
  }, []);

  // Save state to localStorage whenever appState changes
  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  // Helper function to add activity to history
  const addActivity = (entry: Omit<ActivityEntry, "id" | "timestamp">) => {
    const newActivity: ActivityEntry = {
      ...entry,
      id: generateId(),
      timestamp: Date.now(),
    };
    setAppState((prev) => ({
      ...prev,
      activityHistory: [...prev.activityHistory, newActivity],
    }));
  };

  // Currency toggle function
  const toggleCurrency = () => {
    setAppState((prev) => ({
      ...prev,
      currency: prev.currency === 'USD' ? 'YEN' : 'USD',
    }));
  };

  // Helper function to trigger floating animation
  const triggerFloatingAnimation = (
    startElement: HTMLElement,
    targetElement: HTMLElement,
    content: React.ReactNode,
  ) => {
    const startRect = startElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    setFloatingAnimation({
      isVisible: true,
      startPosition: {
        x: startRect.left + startRect.width / 2,
        y: startRect.top + startRect.height / 2,
      },
      targetPosition: {
        x: targetRect.left + targetRect.width / 2,
        y: targetRect.top + targetRect.height / 2,
      },
      content,
    });
  };

  const handleCreateTask = (task: Task) => {
    setAppState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, task],
    }));
    setShowTaskForm(false);
    setSuccessOverlay({
      isVisible: true,
      message: "Task Created!",
      subMessage: "Ready to earn some hearts!",
    });
  };

  const handleCompleteTask = (task: Task, buttonElement?: HTMLElement) => {
    setAppState((prev) => ({
      ...prev,
      hearts: prev.hearts + task.rewardValue,
    }));

    // Add to activity history
    addActivity({
      type: "task_completed",
      description: `Completed "${task.text}"`,
      heartsEarned: task.rewardValue,
    });

    // Trigger floating animation if we have both elements
    if (buttonElement && heartCounterRef.current) {
      triggerFloatingAnimation(
        buttonElement,
        heartCounterRef.current,
        <div className="text-coral flex items-center space-x-1">
          <i className="fas fa-heart"></i>
          <span>+{task.rewardValue}</span>
        </div>,
      );
    }

    setSuccessOverlay({
      isVisible: true,
      message: "Amazing Job!",
      subMessage: `You earned ${task.rewardValue} hearts!`,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setAppState((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((task) => task.id !== taskId),
      }));
    }
  };

  const handleCreateReward = (reward: Reward) => {
    setAppState((prev) => ({
      ...prev,
      rewards: [...prev.rewards, reward],
    }));
    setShowRewardForm(false);
    setSuccessOverlay({
      isVisible: true,
      message: "Reward Created!",
      subMessage: "Something to work towards!",
    });
  };

  const handleClaimReward = (reward: Reward) => {
    if (appState.hearts >= reward.cost) {
      setParentGateModal({ isOpen: true, reward });
    }
  };

  const handleParentConfirm = () => {
    if (parentGateModal.reward) {
      setAppState((prev) => ({
        ...prev,
        hearts: prev.hearts - parentGateModal.reward!.cost,
        claimedRewards: [...prev.claimedRewards, parentGateModal.reward!.id],
      }));

      // Add to activity history
      addActivity({
        type: "reward_claimed",
        description: `Claimed "${parentGateModal.reward.text}"`,
        heartsSpent: parentGateModal.reward.cost,
      });

      // Trigger confetti
      setShowConfetti(true);

      setSuccessOverlay({
        isVisible: true,
        message: "Reward Claimed!",
        subMessage: "Enjoy your reward!",
      });
    }
    setParentGateModal({ isOpen: false, reward: null });
  };

  const handleParentDeny = () => {
    setSuccessOverlay({
      isVisible: true,
      message: "Ask a Parent",
      subMessage: "Please ask a parent to help you claim your reward!",
    });
    setParentGateModal({ isOpen: false, reward: null });
  };

  const handleCollectMoney = (
    rewardId: string,
    buttonElement?: HTMLElement,
  ) => {
    const reward = appState.rewards.find((r) => r.id === rewardId);
    if (reward && reward.moneyValue) {
      setAppState((prev) => ({
        ...prev,
        money: prev.money + reward.moneyValue!,
        claimedRewards: prev.claimedRewards.filter((id) => id !== rewardId),
      }));

      // Add to activity history
      addActivity({
        type: "money_collected",
        description: `Collected ${getCurrencySymbol(appState.currency)}${reward.moneyValue} from "${reward.text}"`,
        moneyEarned: reward.moneyValue,
      });

      // Trigger floating animation if we have both elements
      if (buttonElement && moneyCounterRef.current) {
        triggerFloatingAnimation(
          buttonElement,
          moneyCounterRef.current,
          <div className="text-mint flex items-center space-x-1">
            <i className="fas fa-piggy-bank"></i>
            <span>+{getCurrencySymbol(appState.currency)}{reward.moneyValue}</span>
          </div>,
        );
      }

      setSuccessOverlay({
        isVisible: true,
        message: "Money Collected!",
        subMessage: `You earned ${getCurrencySymbol(appState.currency)}${reward.moneyValue}!`,
      });
    }
  };

  const handleRenewReward = (rewardId: string) => {
    setAppState((prev) => ({
      ...prev,
      claimedRewards: prev.claimedRewards.filter((id) => id !== rewardId),
    }));
    setSuccessOverlay({
      isVisible: true,
      message: "Reward Renewed!",
      subMessage: "Ready to earn again!",
    });
  };

  const handleDeleteReward = (rewardId: string) => {
    if (confirm("Are you sure you want to delete this reward?")) {
      setAppState((prev) => ({
        ...prev,
        rewards: prev.rewards.filter((reward) => reward.id !== rewardId),
        claimedRewards: prev.claimedRewards.filter((id) => id !== rewardId),
      }));
    }
  };

  const handleAddPurchase = (purchase: Purchase, buttonElement?: HTMLElement) => {
    setAppState((prev) => ({
      ...prev,
      money: prev.money - purchase.amount,
      purchases: [...prev.purchases, purchase],
    }));

    // Add to activity history
    addActivity({
      type: "money_spent",
      description: `Spent ${getCurrencySymbol(appState.currency)}${purchase.amount} on "${purchase.description}"`,
      moneySpent: purchase.amount,
    });

    // Trigger floating animation if we have both elements
    if (buttonElement && moneyCounterRef.current) {
      triggerFloatingAnimation(
        buttonElement,
        moneyCounterRef.current,
        <div className="text-red-500 flex items-center space-x-1">
          <i className="fas fa-shopping-cart"></i>
          <span>-{getCurrencySymbol(appState.currency)}{purchase.amount}</span>
        </div>,
      );
    }

    setShowSpendingForm(false);
    setSuccessOverlay({
      isVisible: true,
      message: "Purchase Recorded!",
      subMessage: `You spent ${getCurrencySymbol(appState.currency)}${purchase.amount} on ${purchase.description}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-lg rounded-b-3xl mb-8 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <i className="fas fa-heart text-4xl text-coral animate-heart-beat"></i>
              <h1 className="text-3xl md:text-4xl font-bold text-navy">
                My Heart Rewards
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowActivityHistory(true)}
                className="bg-gray-100 hover:bg-gray-200 text-navy px-4 py-2 rounded-full font-semibold transition-all duration-200 flex items-center space-x-2"
                title="Activity History"
              >
                <i className="fas fa-history"></i>
                <span className="hidden sm:inline">History</span>
              </button>
                          <div ref={moneyCounterRef}>
              <MoneyCounter
                money={appState.money}
                currency={appState.currency}
                onCurrencyToggle={toggleCurrency}
              />
              </div>
              <div ref={heartCounterRef}>
                <HeartCounter hearts={appState.hearts} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-12">
        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Column 1: Tasks */}
          <div className="space-y-6">
            <div className="flex flex-col justify-between items-start mb-6 gap-4">
              <h2 className="text-2xl font-bold text-navy flex items-center">
                <i className="fas fa-tasks text-teal mr-3"></i>
                My Tasks
              </h2>
              <button
                onClick={() => setShowTaskForm(true)}
                className="w-full bg-teal hover:bg-teal-600 text-white px-4 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-plus"></i>
                <span>Add Task</span>
              </button>
            </div>

            <TaskForm
              isVisible={showTaskForm}
              onCreateTask={handleCreateTask}
              onCancel={() => setShowTaskForm(false)}
            />

            <div className="max-h-96 overflow-y-auto">
              <TasksList
                tasks={appState.tasks}
                onCompleteTask={handleCompleteTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          </div>

          {/* Column 2: Rewards */}
          <div className="space-y-6">
            <div className="flex flex-col justify-between items-start mb-6 gap-4">
              <h2 className="text-2xl font-bold text-navy flex items-center">
                <i className="fas fa-gift text-sunny mr-3"></i>
                My Rewards
              </h2>
              <button
                onClick={() => setShowRewardForm(true)}
                className="w-full bg-sunny hover:bg-yellow-500 text-navy px-4 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-plus"></i>
                <span>Add Reward</span>
              </button>
            </div>

            <RewardForm
              isVisible={showRewardForm}
              onCreateReward={handleCreateReward}
              onCancel={() => setShowRewardForm(false)}
              currency={appState.currency}
            />

            <div className="max-h-96 overflow-y-auto">
              <RewardsList
                rewards={appState.rewards}
                hearts={appState.hearts}
                currency={appState.currency}
                claimedRewards={appState.claimedRewards}
                onClaimReward={handleClaimReward}
                onCollectMoney={handleCollectMoney}
                onRenewReward={handleRenewReward}
                onDeleteReward={handleDeleteReward}
              />
            </div>
          </div>

          {/* Column 3: Money Shop */}
          <div className="space-y-6">
            <div className="flex flex-col justify-between items-start mb-6 gap-4">
              <h2 className="text-2xl font-bold text-navy flex items-center">
                <i className="fas fa-shopping-cart text-mint mr-3"></i>
                Money Shop
              </h2>
              <button
                onClick={() => setShowSpendingForm(true)}
                disabled={appState.money <= 0}
                className={`w-full px-4 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                  appState.money > 0
                    ? 'bg-mint hover:bg-green-400 text-navy hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <i className="fas fa-plus"></i>
                <span>Record Purchase</span>
              </button>
            </div>

            <SpendingForm
              isVisible={showSpendingForm}
              onAddPurchase={handleAddPurchase}
              onCancel={() => setShowSpendingForm(false)}
              currency={appState.currency}
              availableMoney={appState.money}
            />

            {/* If you want a scrollable summary/chart, put it here */}
            {/* <div className="max-h-96 overflow-y-auto"> ...summary/chart... </div> */}

            {/* PurchaseHistory is now outside the scrollable div */}
            <div className="mt-6">
              <PurchaseHistory
                purchases={appState.purchases}
                currency={appState.currency}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Parent Gate Modal */}
      <ParentGateModal
        isOpen={parentGateModal.isOpen}
        reward={parentGateModal.reward}
        onConfirm={handleParentConfirm}
        onDeny={handleParentDeny}
        onClose={() => setParentGateModal({ isOpen: false, reward: null })}
      />

      {/* Success Overlay */}
      <SuccessOverlay
        isVisible={successOverlay.isVisible}
        message={successOverlay.message}
        subMessage={successOverlay.subMessage}
        onClose={() =>
          setSuccessOverlay({ isVisible: false, message: "", subMessage: "" })
        }
      />

      {/* Floating Animations */}
      <FloatingAnimation
        isVisible={floatingAnimation.isVisible}
        startPosition={floatingAnimation.startPosition}
        targetPosition={floatingAnimation.targetPosition}
        content={floatingAnimation.content}
        onComplete={() =>
          setFloatingAnimation((prev) => ({ ...prev, isVisible: false }))
        }
      />

      {/* Confetti Effect */}
      <ConfettiEffect
        isVisible={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Activity History Modal */}
      <ActivityHistoryModal
        isOpen={showActivityHistory}
        activityHistory={appState.activityHistory}
        onClose={() => setShowActivityHistory(false)}
      />

      {/* Floating Help Hint */}
      <div className="fixed bottom-6 right-6 space-y-3">
        <div
          className="bg-white rounded-full shadow-lg p-3 text-coral cursor-pointer hover:scale-110 transition-transform"
          title="Welcome to Heart Rewards! Create tasks to earn hearts, then spend them on rewards!"
        >
          <i className="fas fa-question-circle text-2xl"></i>
        </div>
      </div>
    </div>
  );
}
