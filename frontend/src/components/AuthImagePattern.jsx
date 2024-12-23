import { MessageCircle, Users, Globe } from "lucide-react";

const AuthSideSection = ({ title, subtitle }) => {
  return (
    <div className="hidden w-full lg:flex h-full flex-col items-center justify-center bg-gradient-to-br from-accent to-primary p-12 rounded-lg">
      {/* Icon Section */}
      <div className="relative w-full h-full mb-8 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <MessageCircle className="w-12 h-12 text-white" />
        </div>
        <div className="absolute left-[0px] top-8">
          <Users className="w-8 h-8 text-white/80" />
        </div>
        <div className="absolute right-[0px] bottom-8">
          <Globe className="w-8 h-8 text-white/80" />
        </div>
      </div>

      {/* Text Content */}
      <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
      <p className="text-lg text-white/80 text-center">{subtitle}</p>
    </div>
  );
};

export default AuthSideSection;
