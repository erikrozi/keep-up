import React from 'react';
import { Badge } from "./badge.tsx"
import { Button } from "./button.tsx"
import { ThumbsUp, Bookmark } from "lucide-react"

const PaperContainer: React.FC = () => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold mb-4">Paper Title</h1>
                <div className="flex space-x-1">
                    <Button variant="outline" size="icon">
                        <ThumbsUp className='h-5 w-5' />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Bookmark className='h-5 w-5' />
                    </Button>
                </div>
            </div>
            
            <div className="flex flex-wrap mb-4 space-x-2">
                <Badge variant="default">Author 1</Badge>
                <Badge variant="default">Author 2</Badge>
                <Badge variant="default">Author 3</Badge>
                {/* Add more authors here */}
            </div>

            <div className="flex flex-wrap mb-4 space-x-2">
                <Badge variant="default">Computer Science</Badge>
                <Badge variant="default">Machine Learning</Badge>
                <Badge variant="default">Deep Learning</Badge>
                {/* Add more tags here */}
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-lg p-4 mb-4">
                <div>
                    <h2 className="text-xl font-bold mb-4">Summary</h2>
                    <div className="bg-purple-200 p-4 mb-4 rounded-lg">
                        <p className="text-gray-600">Paper Summary</p>
                    </div>
                    <h2 className="text-xl font-bold mb-4">Related Papers</h2>
                    <div className="flex flex-wrap mb-4">
                        <p className="mr-2 mb-2 bg-gray-200 rounded-full py-1 px-2 text-m">Related Paper 1</p>
                        <p className="mr-2 mb-2 bg-gray-200 rounded-full py-1 px-2 text-m">Related Paper 2</p>
                        {/* Add more related papers here */}
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4">Abstract</h2>
                    <div className="bg-blue-200 p-4 mb-4 rounded-lg">
                        <p className="text-gray-600">Paper Abstract Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac nisl non libero euismod condimentum. Nullam nec metus ac justo ultrices scelerisque. Integer ut libero vitae turpis auctor varius. Donec sit amet ante auctor, tincidunt turpis sed, congue nunc. Nullam nec metus ac justo ultrices scelerisque. Integer ut libero vitae turpis auctor varius. Donec sit amet ante auctor, tincidunt turpis sed, congue nunc. Nullam nec metus ac justo ultrices scelerisque. Integer ut libero vitae turpis auctor varius. Donec sit amet ante auctor, tincidunt turpis sed, congue nunc.</p>
                    </div>
                </div>
            </div>

            <Button variant="link" size="default">
                Full Text
            </Button>
        </div>
    );
};

export { PaperContainer };