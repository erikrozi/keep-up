import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Badge } from "./badge.tsx";
import { Button } from "./button.tsx";
import { ThumbsUp, Bookmark } from "lucide-react";
import { supabase } from '../../utils/supabase.ts';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

import api from '../../utils/api.js';


const PaperContainer: React.FC<{ corpus_id: any ,user: any}> = ({ corpus_id, user}) => {
  const [paperData, setPaperData] = useState({
    abstract: '',
    metadata: {
      publicationdate: '',
      authors: [],
      citationcount: 0,
      title: '',
      venue: '',
      url: '',
      year: 0,
      s2fieldsofstudy: [],
    }
  });

  const [paperSummary, setPaperSummary] = useState(''); // Add a new state variable to store the paper summary
  const [paperResults, setPaperResults] = useState(''); // Add a new state variable to store the paper results
  const [relatedPapers, setRelatedPapers] = useState([]); // Add a new state variable to store the related papers

  const fetchPaperData = async () => {
    const response = await api.get('/papers/' + corpus_id);
    setPaperData(response.data);
  }

  const fetchPaperSummary = async () => {
    const response = await api.get('/papers/' + corpus_id + '/summary');
    setPaperSummary(response.data.summary);
  }

  const fetchPaperResults = async () => {
    const response = await api.get('/papers/' + corpus_id + '/results');
    setPaperResults(response.data.results);
  }

  const fetchRelatedPapers = async () => {
    const response = await api.get('/papers/' + corpus_id + '/related');
    setRelatedPapers(response.data);
  }

  useEffect(() => {
    fetchPaperData();
    fetchPaperSummary();
    fetchPaperResults();
    fetchRelatedPapers();
  }, [corpus_id]);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const lastTapRef = useRef(0);

  const userId = user.id; // Get the user ID from Supabase authentication  

  useEffect(() => {
    const fetchLikeCount = async () => {
      if (!corpus_id) {
        return;
      }

      const { count, error } = await supabase
        .from('liked_papers')
        .select('*', { count: 'exact' })
        .eq('corpus_id', corpus_id);

      if (error) {
        console.error('Error fetching like count:', error);
      } else {
        setLikeCount(count);
      }
    };

    const checkIfLiked = async () => {
      if (!user || !corpus_id) return;

      const { data, error } = await supabase
        .from('liked_papers')
        .select('*')
        .eq('user_id', userId)
        .eq('corpus_id', corpus_id);

      if (error) {
        console.error('Error checking if paper is liked:', error);
      } else {
        setIsLiked(data.length > 0);
      }
    };

    const trackPaperView = async () => {
      if (!user || !corpus_id) {
        return;
      }

      const { error } = await supabase
        .from('seen_papers')
        .insert([
          { user_id: user.id, corpus_id: corpus_id }
        ]);

      if (error) {
        console.error('Error tracking paper view:', error);
      }
    };

    fetchLikeCount();
    checkIfLiked();
    trackPaperView();
  }, [user, corpus_id]);

  const toggleLike = async () => {
    if (isLiked) {
      // Unlike the paper (delete the row)
      const { error } = await supabase
        .from('liked_papers')
        .delete()
        .eq('user_id', userId)
        .eq('corpus_id', corpus_id);

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
          { user_id: userId, corpus_id: corpus_id }
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

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      toggleLike();
    }
    lastTapRef.current = now;
  };

  return (
    <div className="bg-card border border-gray-200 shadow-lg rounded-lg p-6 h-[80vh] overflow-auto" onClick={handleDoubleTap}>
      <div className="flex justify-between is-center">
        <h1 className="text-4xl font-bold mb-4">
          {paperData.metadata.title}
        </h1>
        <div className="flex space-x-2 items-center">
          <Button variant="outline" size="icon" onClick={toggleLike} style={isLiked ? { color: "#3a88fe" } : { color: "#000" }}>
            <ThumbsUp className={`h-5 w-5`} />
            <p>{likeCount}</p>
          </Button>
          <Dialog>
          <DialogTrigger><Button 
            variant="outline"
            size="default">
            View Abstract
          </Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-bold mb-4">Abstract</DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-black">{paperData.abstract}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
          <Button
            variant="purple"
            size="default"
            onClick={() =>
              window.open(
                paperData.metadata.url,
                "_blank"
              )
            }
          >
            Full Text
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap mb-4 space-x-2 text-gray-500 text-xs">
        {paperData.metadata.authors && paperData.metadata.authors.length > 0 && (
          <>
            {paperData.metadata.authors.slice(0, 3).map((author, index) => (
              <p key={author.name}>
                {author.name}{index < 2 && index < paperData.metadata.authors.length - 1 ? ', ' : ''}
              </p>
            ))}
            {paperData.metadata.authors.length > 3 && <p>...</p>}
          </>
        )}

        <p>•</p>
        <p>Published in {paperData.metadata.year}</p>
        <p>•</p>
        <p>Citations: {paperData.metadata.citationcount}</p>
      </div>

      <div className="flex flex-wrap mb-4 space-x-2">
        {/* For item inside s2fieldsofstudy, which is a list of dictionaries, get the value corresponding to key 'category'*/}
        {paperData.metadata.s2fieldsofstudy && paperData.metadata.s2fieldsofstudy.length > 0 && (
          paperData.metadata.s2fieldsofstudy.map((field) => (
            <Badge variant="secondary" key={field.category}>{field.category}</Badge>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-lg p-4 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold mb-4">Summary</h2>
          <div className="bg-muted p-4 mb-4 rounded-lg text-sm sm:text-base">
            <ReactMarkdown>
              {/* Render the paper summary, if not summary then loading */}
              {
                paperSummary ? paperSummary : 'Generating Summary...'
              }
            </ReactMarkdown>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-8">
            <div className="basis-1/3">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Paper Venue</h2>
              <div className="flex flex-wrap mb-4">
                <p className="mr-2 mb-2 bg-[#2B59C3] rounded-full py-2 px-4 text-xs sm:text-sm text-white font-bold items-center">
                  {paperData.metadata.venue}
                </p>
              </div>
            </div>
            <div className="basis-2/3">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Related Papers</h2>
              <div className="flex flex-wrap mb-4">
                {/* Render the related papers */
                  relatedPapers.map((paper) => (
                    <p key={paper.metadata.corpus_id} className="mr-2 mb-2 bg-gray-200 hover:bg-gray-300 rounded-full py-2 px-4 text-xs sm:text-sm font-bold">
                      {paper.metadata.title}
                    </p>
                  ))      
                }
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Results</h2>
            <div className="bg-muted p-4 mb-4 rounded-lg text-sm sm:text-base">
              <ReactMarkdown>
                {/* Render the paper summary, if not summary then loading */}
                {
                  paperResults ? paperResults : 'Generating Results...'
                }
              </ReactMarkdown>
              
            </div>
          </div>
      </div>
    </div>
  );
};

export { PaperContainer };
