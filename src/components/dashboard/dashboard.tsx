import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import MainContent from "./mainContent";
import { Option } from "./option";


const Dashboard = () => {
  const user = useSelector((state: RootState) => state.resume.user);

  if (user?.isResume === "resume") {
    return <Option />;
  }

  return <MainContent />;
};

export default Dashboard;
