import { MessageCirclePlus } from "lucide-react"; // Assuming you're using lucide-react for icons

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex justify-center items-center bg-base-100 p-4 md:p-8">
      <div className="text-center">
        <MessageCirclePlus size={80} className="text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-base-content mb-2">
          No Chat Selected
        </h2>
        <p className="text-sm text-base-content/70 mb-4">
          Please select a user to start chatting or choose from your previous conversations.
        </p>
        <button className="btn btn-primary px-6 py-3 text-sm rounded-lg transition-all hover:bg-primary/90">
          Select a Chat
        </button>
      </div>
    </div>
  );
};

export default NoChatSelected;
