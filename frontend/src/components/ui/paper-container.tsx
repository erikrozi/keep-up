import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Badge } from "./badge.tsx";
import { Button } from "./button.tsx";
import { ThumbsUp, Bookmark } from "lucide-react";
import { supabase } from '../../utils/supabase.ts';


const PaperContainer: React.FC<{ paper: any, abstract: any, user: any}> = ({ paper, abstract, user}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const userId = user.id; // Get the user ID from Supabase authentication  
  const authorNames = JSON.parse(paper.authors).map((author: any) => author.name).join(", ");
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  const formattedDate = formatDate(paper.publicationdate);

  useEffect(() => {
    const fetchLikeCount = async () => {
      if (!paper) {
        return;
      }

      const { count, error } = await supabase
        .from('liked_papers')
        .select('*', { count: 'exact' })
        .eq('corpus_id', paper.corpus_id);

      if (error) {
        console.error('Error fetching like count:', error);
      } else {
        setLikeCount(count);
      }
    };

    const checkIfLiked = async () => {
      if (!user || !paper) return;

      const { data, error } = await supabase
        .from('liked_papers')
        .select('*')
        .eq('user_id', userId)
        .eq('corpus_id', paper.corpus_id);

      if (error) {
        console.error('Error checking if paper is liked:', error);
      } else {
        setIsLiked(data.length > 0);
      }
    };

    const trackPaperView = async () => {
      if (!user || !paper) {
        return;
      }

      const { error } = await supabase
        .from('seen_papers')
        .insert([
          { user_id: user.id, corpus_id: paper.corpus_id }
        ]);

      if (error) {
        console.error('Error tracking paper view:', error);
      }
    };

    fetchLikeCount();
    checkIfLiked();
    trackPaperView();
  }, [user, paper]);

  const toggleLike = async () => {
    if (isLiked) {
      // Unlike the paper (delete the row)
      const { error } = await supabase
        .from('liked_papers')
        .delete()
        .eq('user_id', userId)
        .eq('corpus_id', paper.corpus_id);

      if (error) {
        console.error('Error unliking the paper:', error);
      } else {
        setIsLiked(false);
        setLikeCount(likeCount - 1);
        console.log('Paper unliked successfully');
      }
    } else {
      // Like the paper (insert a row)
      const { error } = await supabase
        .from('liked_papers')
        .insert([
          { user_id: userId, corpus_id: paper.corpus_id }
        ]);

      if (error) {
        console.error('Error liking the paper:', error);
      } else {
        setIsLiked(true);
        setLikeCount(likeCount + 1);
        console.log('Paper liked successfully');
      }
    }
  };

  return (
    <div className="bg-card border border-gray-200 shadow-lg rounded-lg p-6">
      <div className="flex justify-between is-center">
        <h1 className="text-4xl font-bold mb-4">
          {paper.title}
        </h1>
        <div className="flex space-x-2 items-center">
          <Button variant="outline" size="icon" onClick={toggleLike} style={isLiked ? { color: "#3a88fe" } : { color: "#000" }}>
            <ThumbsUp className={`h-5 w-5`} />
            <p>{likeCount}</p>
          </Button>
           {/* <Button variant="outline" size="icon">
            <ThumbsUp className={`h-5 w-5`} />
          </Button> */}
          {/* <Button variant="outline" size="icon">
            <Bookmark className="h-5 w-5" />
          </Button> */}
          <Button
            variant="purple"
            size="default"
            onClick={() =>
              window.open(
                paper.url,
                "_blank"
              )
            }
          >
            Full Text
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap mb-4 space-x-2 text-gray-500 text-xs">
        <p>{authorNames}</p>
        <p>•</p>
        <p>Published on {formattedDate}</p>
        <p>•</p>
        <p>{paper.citationcount}</p>
      </div>

      <div className="flex flex-wrap mb-4 space-x-2">
        <Badge variant="secondary">Computer Science</Badge>
        <Badge variant="secondary">Machine Learning</Badge>
        <Badge variant="secondary">Deep Learning</Badge>
        {/* Add more tags here */}
      </div>

      {/* <div>
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
            </div>*/}

      <div className="grid grid-cols-2 gap-16 rounded-lg p-4 mb-4">
        <div>
          <h2 className="text-xl font-bold mb-4">Summary</h2>
          <div className="bg-muted p-4 mb-4 rounded-lg">
            <ReactMarkdown>
             {abstract.abstract}
            </ReactMarkdown>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Credibility</h2>
            <div className="flex flex-wrap mb-4">
              <p className="mr-2 mb-2 bg-[#2B59C3] rounded-full py-2 px-4 text-m text-white font-bold">
                ICLR
              </p>
              <p className="mr-2 mb-2 bg-[#2B59C3] rounded-full py-2 px-4 text-m text-white font-bold">
                Microsoft
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Related Papers</h2>
            <div className="flex flex-wrap mb-4">
              <p className="mr-2 mb-2 bg-gray-200 hover:bg-gray-300 rounded-full py-2 px-4 text-m font-bold">
                Attention is All You Need
              </p>
              <p className="mr-2 mb-2 bg-gray-200 hover:bg-gray-300 rounded-full py-2 px-4 text-m font-bold">
                Related Paper 2
              </p>
            </div>
          </div>
        </div>
        <div>
          <iframe
            src="https://arxiv.org/pdf/2106.09685"
            title="Paper"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export { PaperContainer };
