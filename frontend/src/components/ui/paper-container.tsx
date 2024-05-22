import React from "react";
import ReactMarkdown from "react-markdown";

import { Badge } from "./badge.tsx";
import { Button } from "./button.tsx";
import { ThumbsUp, Bookmark } from "lucide-react";

const PaperContainer: React.FC = () => {
  return (
    <div className="bg-card border border-gray-200 shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          LORA: Low-Rank Adaptation of Large Language Models
        </h1>
        <div className="flex space-x-1">
          <Button variant="outline" size="icon">
            <ThumbsUp className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button
            variant="purple"
            size="default"
            onClick={() =>
              window.open(
                "https://www.semanticscholar.org/paper/LoRA%3A-Low-Rank-Adaptation-of-Large-Language-Models-Hu-Shen/a8ca46b171467ceb2d7652fbfb67fe701ad86092",
                "_blank"
              )
            }
          >
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-lg p-4 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold mb-4">Summary</h2>
          <div className="bg-muted p-4 mb-4 rounded-lg text-sm sm:text-base">
            <ReactMarkdown>
              **Low-Rank Adaptation (LoRA)** offers a feasible solution to adapt
              large pre-trained models like **GPT-3 175B** for specific tasks by
              injecting trainable rank decomposition matrices into each
              Transformer layer, which **reduces the trainable parameters by
              10,000 times** and **GPU memory needs by 3 times**. This method
              **maintains or surpasses the quality** of traditional fine-tuning,
              offers higher training throughput, and does not add inference
              latency, with empirical support and tools available at
              [Microsoft's GitHub](https://github.com/microsoft/LoRA).
            </ReactMarkdown>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-8">
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-4">Credibility</h2>
              <div className="flex flex-wrap mb-4">
                <p className="mr-2 mb-2 bg-[#2B59C3] rounded-full py-2 px-4 text-xs sm:text-sm text-white font-bold">
                  ICLR
                </p>
                <p className="mr-2 mb-2 bg-[#2B59C3] rounded-full py-2 px-4 text-xs sm:text-sm text-white font-bold">
                  Microsoft
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-4">Related Papers</h2>
              <div className="flex flex-wrap mb-4">
                <p className="mr-2 mb-2 bg-gray-200 hover:bg-gray-300 rounded-full py-2 px-4 text-xs sm:text-sm font-bold">
                  Attention is All You Need
                </p>
                <p className="mr-2 mb-2 bg-gray-200 hover:bg-gray-300 rounded-full py-2 px-4 text-xs sm:text-sm font-bold">
                  Related Paper 2
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <iframe
            src="https://arxiv.org/pdf/2106.09685"
            title="Paper"
            className="w-full h-64 md:h-full"
          />
        </div>
      </div>
    </div>
  );
};

export { PaperContainer };
