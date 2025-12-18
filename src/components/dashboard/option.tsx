import { resetInterview } from "@/store/interviewSlice";
import { clearResume } from "@/store/resumeSlice";
import type { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const Option = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state:RootState) => state.resume.user);
  
  if(!user){
    navigate("/", {replace: true});
  }

  const handleNewResume = () => {
    dispatch(resetInterview());
    dispatch(clearResume());
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
      <div className="flex flex-col gap-3 mt-8 p-6 border border-white/20 rounded-xl bg-white/5">
        <h3 className="text-blue-100 text-center mb-2">Session Options</h3>
        
        <div className="flex gap-3">
          <Button 
            onClick={handleNewResume} 
            variant="destructive"
          >
            Upload New Resume (Clear All)
          </Button>
        </div>
      </div>
    </div>
    
  );
};
