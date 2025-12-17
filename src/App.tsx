import { Header } from "./components/dashboard/header"
import { Toaster } from "./components/ui/sonner"
import Dashboard from "./components/dashboard/dashboard"
import {Routes, BrowserRouter, Route} from "react-router-dom"
import { AtsScore } from "./components/dashboard/atsScore"
import { InterView } from "./components/dashboard/interView"
import Evaluation from "./components/dashboard/evaluation"

function App() {

  return (
    <BrowserRouter>
      <div className="w-screen h-screen flex flex-col">
        <Header/>
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/interview" element={<InterView/>}/>
            <Route path="/atsscore" element={<AtsScore/>}/>
            <Route path="/evaluation" element={<Evaluation/>}/>
        </Routes>
      </div>
          <Toaster/>
    </BrowserRouter>
  )
}

export default App