// グループ別のメッセージを定義
export interface GroupInfo {
  cond: number;
  participantOrder: number;
}

export interface GroupConfig {
  title: string;
  message: string;
  color: string;
  showGroupGoals: boolean; // グループ全体の目標を表示するか
  showIndividualRanking: boolean; // 個人ランキングを表示するか
}

export function getGroupMessage(groupInfo: GroupInfo): {
  title: string;
  message: string;
  color: string;
} {
  switch (groupInfo.cond) {
    case 1: // Group A
      return {
        title: "Group A",
        message:
          "Thank you for participating in the experiment. We will be collecting responses for **12 hours starting at 9:00 AM America time** from tomorrow onwards. We will display the **group's overall goals and individual rankings**, so please participate actively!",
        color: "blue",
      };
    case 2: // Group B
      return {
        title: "Group B",
        message:
          "Thank you for participating in the experiment. We will be collecting responses for **12 hours starting at 9:00 AM America time** from tomorrow onwards. We will display **individual rankings**, so please participate actively!",
        color: "green",
      };
    case 3: // Group C
      return {
        title: "Group C",
        message:
          "Thank you for participating in the experiment. We will be collecting responses for **12 hours starting at 9:00 AM America time** from tomorrow onwards. We will display the **overall goals**, so please participate actively!",
        color: "purple",
      };
    case 4: // Group D
      return {
        title: "Group D",
        message:
          "Thank you for participating in the experiment. We will be collecting responses for **12 hours starting at 9:00 AM America time** from tomorrow onwards. Please participate actively!",
        color: "orange",
      };
    default:
      return {
        title: "Participant",
        message: "Thank you for participating in the experiment.",
        color: "gray",
      };
  }
}

// フィードバック表示設定を取得
export function getGroupConfig(cond: number): GroupConfig {
  switch (cond) {
    case 1: // Group A - グループ目標 + 個人ランキング表示
      return {
        title: "Group A",
        message:
          "Thank you for participating in the experiment. We will be collecting responses for **12 hours starting at 9:00 AM America time** from tomorrow onwards. We will display the **group's overall goals and individual rankings**, so please participate actively!",
        color: "blue",
        showGroupGoals: true,
        showIndividualRanking: true,
      };
    case 2: // Group B - 個人ランキングのみ表示
      return {
        title: "Group B",
        message:
          "Thank you for participating in the experiment. We will be collecting responses for **12 hours starting at 9:00 AM America time** from tomorrow onwards. We will display **individual rankings**, so please participate actively!",
        color: "green",
        showGroupGoals: false,
        showIndividualRanking: true,
      };
    case 3: // Group C - グループ目標のみ表示
      return {
        title: "Group C",
        message:
          "Thank you for participating in the experiment. We will be collecting responses for **12 hours starting at 9:00 AM America time** from tomorrow onwards. We will display the **overall goals**, so please participate actively!",
        color: "purple",
        showGroupGoals: true,
        showIndividualRanking: false,
      };
    case 4: // Group D - フィードバック非表示
      return {
        title: "Group D",
        message:
          "Thank you for participating in the experiment. We will be collecting responses for **12 hours starting at 9:00 AM America time** from tomorrow onwards. Please participate actively!",
        color: "orange",
        showGroupGoals: false,
        showIndividualRanking: false,
      };
    default:
      return {
        title: "Participant",
        message: "Thank you for participating in the experiment.",
        color: "gray",
        showGroupGoals: false,
        showIndividualRanking: false,
      };
  }
}

// フィードバック表示判定用のヘルパー関数
export function shouldShowGroupGoals(cond: number): boolean {
  return getGroupConfig(cond).showGroupGoals;
}

export function shouldShowIndividualRanking(cond: number): boolean {
  return getGroupConfig(cond).showIndividualRanking;
}

export function shouldShowAnyFeedback(cond: number): boolean {
  const config = getGroupConfig(cond);
  return config.showGroupGoals || config.showIndividualRanking;
}
