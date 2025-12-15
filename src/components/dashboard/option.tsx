import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export const Option = () => {

  const naviagte = useNavigate();
  const user = useSelector((state:RootState) => state.resume.user);
  if(!user){
    naviagte("/", {replace: true});
  }

  return (
    <div className="flex-1 bg-lavender-grape flex flex-col items-center justify-center">
      <div className="text-2xl mb-4 flex p-2">
        Hi There!! {user?.name}
      </div>
      <div>
        <Link to={"/interview"} className="p-4 mr-1 inline-block px-4 py-2 bg-dark-purple-gray text-blue-100 rounded-md hover:bg-lavender-gray transition">Interview</Link>      
        <Link to={"/atsscore"} className="p-4 ml-1 inline-block px-4 py-2 bg-dark-purple-gray text-blue-100 rounded-md hover:bg-lavender-gray transition">ATS Score</Link>      
      </div>
    </div>
  );
};
