import { LoaderIcon } from "lucide-react";


const Loader = () => {
    return (
        <div className="flex items-center justify-center">
            <LoaderIcon className="h-5 w-5 animate-spin text-gray-400 animation-duration-[1.2s]" />
        </div>

    );
}

export default Loader;
