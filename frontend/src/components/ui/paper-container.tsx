import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Badge } from "./badge.tsx"
import { Button } from "./button.tsx"
import { ThumbsUp, Bookmark } from "lucide-react"

const PaperContainer: React.FC = () => {
    return (
        <div className="bg-card shadow-lg rounded-lg p-6 mx-12 my-5">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold mb-4">LORA: Low-Rank Adaptation of Large Language Models</h1>
                <div className="flex space-x-1">
                    <Button variant="outline" size="icon">
                        <ThumbsUp className='h-5 w-5' />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Bookmark className='h-5 w-5' />
                    </Button>
                    <Button variant="purple" size="default">
                        Full Text
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap mb-4 space-x-2 text-gray-500 text-xs">
                <p>Edward Hu, Yelong Shen, Phillip Wallis, ...</p>
                <p>•</p>
                <p>Published on 06/17/2021</p>
                <p>•</p>
                <p>3345 Citations</p>
            </div>

            <div className="flex flex-wrap mb-4 space-x-2">
                <Badge variant="secondary">Computer Science</Badge>
                <Badge variant="secondary">Machine Learning</Badge>
                <Badge variant="secondary">Deep Learning</Badge>
                {/* Add more tags here */}
            </div>
            <div>
                <h2 className="text-xl font-bold mb-4">Summary</h2>
                <div className="bg-muted p-4 mb-4 rounded-lg">
                    <ReactMarkdown>**Low-Rank Adaptation (LoRA)** offers a feasible solution to adapt large pre-trained models like **GPT-3 175B** for specific tasks by injecting trainable rank decomposition matrices into each Transformer layer, which **reduces the trainable parameters by 10,000 times** and **GPU memory needs by 3 times**. This method **maintains or surpasses the quality** of traditional fine-tuning, offers higher training throughput, and does not add inference latency, with empirical support and tools available at [Microsoft's GitHub](https://github.com/microsoft/LoRA).
</ReactMarkdown>
                </div>
                <div className= "grid grid-cols-2 gap-4">
                    <div>
                        <h2 className="text-xl font-bold mb-4">Credibility</h2>
                        <div className="flex flex-wrap mb-4">
                            <p className="mr-2 mb-2 bg-[#2B59C3] rounded-full py-2 px-4 text-m text-white font-bold">ICLR</p>
                            <p className="mr-2 mb-2 bg-[#2B59C3] rounded-full py-2 px-4 text-m text-white font-bold">Microsoft</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-4">Related Papers</h2>
                        <div className="flex flex-wrap mb-4">
                            <p className="mr-2 mb-2 bg-gray-200 hover:bg-gray-300 rounded-full py-2 px-4 text-m font-bold">Attention is All You Need</p>
                            <p className="mr-2 mb-2 bg-gray-200 hover:bg-gray-300 rounded-full py-2 px-4 text-m font-bold">Related Paper 2</p>
                        </div>
                    </div>
                </div>
            </div>

            {/*<div className="grid grid-cols-2 gap-4 rounded-lg p-4 mb-4">
                <div>
                    <h2 className="text-xl font-bold mb-4">Summary</h2>
                    <div className="bg-pastel-purple-200 p-4 mb-4 rounded-lg">
                        <p className="text-black">In the field of natural language processing, the proposed Low-Rank Adaptation (LoRA) technique allows for adapting large pre-trained models like GPT-3 175B to specific tasks with significantly fewer trainable parameters, reducing the number by up to 10,000 times and tripling the efficiency in GPU memory usage compared to traditional full fine-tuning methods. LoRA, which integrates easily with PyTorch models, maintains or surpasses the performance of fully fine-tuned models without adding extra inference latency, and the developers have provided resources and tools for its implementation online. </p>
                    </div>
                    <h2 className="text-xl font-bold mb-4">Credibility</h2>
                    <div className="flex flex-wrap mb-4">
                        <p className="mr-2 mb-2 bg-yellow-100 hover:bg-yellow-200 rounded-full py-2 px-4 text-m font-bold">Nature</p>
                        <p className="mr-2 mb-2 bg-red-100 hover:bg-red-200 rounded-full py-2 px-4 text-m font-bold">Stanford University</p>
                        <p className="mr-2 mb-2 bg-green-100 hover:bg-green-200 rounded-full py-2 px-4 text-m font-bold">Peer Reviewed</p>
                    </div>
                    <h2 className="text-xl font-bold mb-4">Related Papers</h2>
                    <div className="flex flex-wrap mb-4">
                        <p className="mr-2 mb-2 bg-gray-200 hover:bg-gray-300 rounded-full py-2 px-4 text-m font-bold">Attention is All You Need</p>
                        <p className="mr-2 mb-2 bg-gray-200 hover:bg-gray-300 rounded-full py-2 px-4 text-m font-bold">Related Paper 2</p>
                    </div>
                    <Button variant='default'>Give Me Background Info</Button>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4">Abstract</h2>
                    <div className="bg-cornflower-200 p-4 mb-4 rounded-lg">
                        <p className="text-black">An important paradigm of natural language processing consists of large-scale pre- training on general domain data and adaptation to particular tasks or domains. As we pre-train larger models, full fine-tuning, which retrains all model parameters, becomes less feasible. Using GPT-3 175B as an example – deploying indepen- dent instances of fine-tuned models, each with 175B parameters, is prohibitively expensive. We propose Low-Rank Adaptation, or LoRA, which freezes the pre- trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture, greatly reducing the number of trainable pa- rameters for downstream tasks. Compared to GPT-3 175B fine-tuned with Adam, LoRA can reduce the number of trainable parameters by 10,000 times and the GPU memory requirement by 3 times. LoRA performs on-par or better than fine- tuning in model quality on RoBERTa, DeBERTa, GPT-2, and GPT-3, despite hav- ing fewer trainable parameters, a higher training throughput, and, unlike adapters, no additional inference latency. We also provide an empirical investigation into rank-deficiency in language model adaptation, which sheds light on the efficacy of LoRA. We release a package that facilitates the integration of LoRA with PyTorch models and provide our implementations and model checkpoints for RoBERTa, DeBERTa, and GPT-2 at https://github.com/microsoft/LoRA.</p>
                    </div>
                </div>
            </div>*/}
        </div>
    );
};

export { PaperContainer };