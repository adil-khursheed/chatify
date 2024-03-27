import React from "react";

interface IParams {
  chatId: string;
}

const ChatDetailsPage = ({ params }: { params: IParams }) => {
  return (
    <div className="md:pl-[420px] bg-white dark:bg-slate-800 h-full">
      ChatDetailsPage
    </div>
  );
};

export default ChatDetailsPage;
