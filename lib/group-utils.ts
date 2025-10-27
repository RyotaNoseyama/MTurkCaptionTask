// グループ別のメッセージを定義
export interface GroupInfo {
  cond: number;
  participantOrder: number;
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
