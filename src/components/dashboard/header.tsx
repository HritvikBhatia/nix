import { SiGooglegemini } from "react-icons/si"
import { FiCloudRain } from "react-icons/fi"

export const Header = () => {
    return <div>
        <header className="w-full h-20 bg-dark-purple-gray p-2 px-4 flex justify-between">
            <div className="flex items-center gap-1">
                <FiCloudRain className="text-green-teal h-10 w-10 mr-1"/>
                <div>
                    <h2 className="text-4xl font-bold text-blue-100">NIX AI</h2>
                    <p className="text-blue-100">Interview Assistant</p>
                </div>
            </div>
            <div className="flex items-center">
                <SiGooglegemini className="text-blue-100 mr-1" />
                <p className="text-blue-100">Powered By AI</p>
            </div>
        </header>
    </div>
}