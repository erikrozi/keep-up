import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "../components/ui/checkbox.tsx";
import { useForm } from "react-hook-form";
import { Progress } from '../components/ui/progress.tsx';
import { Button } from "../components/ui/button.tsx";
import useSupabaseUser from '../hooks/useSupabaseUser';
import { supabase } from '../../src/utils/supabase.ts';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form.tsx"

function OnboardingFive() {
  const navigate = useNavigate();
  const form = useForm();

  const { user, loading, error } = useSupabaseUser();

  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedSubtopics, setSelectedSubtopics] = useState([]);
  const [customTopics, setCustomTopics] = useState([]);
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const progress = 50; // Halfway through onboarding

  useEffect(() => {
    getTopics();
    getSubtopics();
  }, []);

  async function getTopics() {
    const { data } = await supabase.from("topics").select("topic_id, topic_name");
    setTopics(data);
  }

  async function getSubtopics() {
    const { data } = await supabase.from("subtopics").select("subtopic_id, topic_id, subtopic_name");
    setSubtopics(data);
  }

  const handleBack = () => {
    navigate('/personalInfo'); // Adjust the path to your previous step
  };

  const handleCheckboxChange = (topic) => {
    const isSelected = selectedTopics.includes(topic);
    if (isSelected) {
      setSelectedTopics(selectedTopics.filter((item) => item.topic_id !== topic.topic_id));

      const associatedSubtopicIds = subtopics.filter(subtopic => subtopic.topic_id === topic.topic_id).map(subtopic => subtopic.subtopic_id);
      setSelectedSubtopics(selectedSubtopics.filter((subtopic) => !associatedSubtopicIds.includes(subtopic.subtopic_id)));

      setErrorMessage(''); // Clear error message when unchecking
    } else {
      if (selectedTopics.length < 5) {
        setSelectedTopics([...selectedTopics, topic]);
        setErrorMessage(''); // Clear error message when selecting within limit
      } else {
        setErrorMessage('You can only select up to 5 topics.');
      }
    }
  };

  const handleSubtopicChange = (subtopic) => {
    const isSelected = selectedSubtopics.includes(subtopic);
    if (isSelected) {
      setSelectedSubtopics(selectedSubtopics.filter((item) => item.subtopic_id !== subtopic.subtopic_id));
      setErrorMessage(''); // Clear error message when unchecking
    } else {
      if (selectedSubtopics.length < 15) {
        setSelectedSubtopics([...selectedSubtopics, subtopic]);
        setErrorMessage(''); // Clear error message when selecting within limit
      } else {
        setErrorMessage('You can only select up to 15 subtopics.');
      }
    }
  };

  const handleCustomTopicChange = (event) => {
    setCustomTopicInput(event.target.value);
  };

  const addCustomTopic = () => {
    if (customTopicInput.trim() === '') return;
    if (customTopics.length >= 5) {
      setErrorMessage('You can only add up to 5 custom topics.');
      return;
    }
    setCustomTopics([...customTopics, { topic_name: customTopicInput.trim() }]);
    setCustomTopicInput('');
    setErrorMessage('');
  };

  const removeCustomTopic = (index) => {
    const newCustomTopics = [...customTopics];
    newCustomTopics.splice(index, 1);
    setCustomTopics(newCustomTopics);
    setErrorMessage('');
  };

  const onSubmit = async () => {
    if (!user) {
      setErrorMessage('User is not logged in.');
      return;
    }
    
    const interests = [];
    
    // Prepare interests for existing topics
    selectedTopics.forEach((topic) => {
      interests.push({
        user_id: user.id,
        topic_id: topic.topic_id,
      });
      selectedSubtopics.forEach((subtopic) => {
        if (subtopic.topic_id === topic.topic_id) {
          interests.push({
            user_id: user.id,
            topic_id: topic.topic_id,
            subtopic_id: subtopic.subtopic_id,
          });
        }
      });
    });

    // Handle custom topics
    for (const customTopic of customTopics) {
      // Check if custom topic already exists
      const { data: existingTopics, error: fetchError } = await supabase
        .from('topics')
        .select('topic_id')
        .eq('topic_name', customTopic.topic_name);
      
      if (fetchError) {
        console.error('Error fetching topics:', fetchError);
        setErrorMessage('Failed to fetch topics. Please try again.');
        return;
      }

      let topicId;
      if (existingTopics.length > 0) {
        // Topic already exists
        topicId = existingTopics[0].topic_id;
      } else {
        // Add new custom topic
        const { data: newTopicData, error: topicError } = await supabase
          .from('topics')
          .insert([{ topic_name: customTopic.topic_name }])
          .select();
        if (topicError) {
          console.error('Error adding custom topic:', topicError);
          setErrorMessage('Failed to add custom topic. Please try again.');
          return;
        }
        topicId = newTopicData[0].topic_id;
      }

      interests.push({
        user_id: user.id,
        topic_id: topicId,
      });
    }

    const { error: interestsError } = await supabase
      .from('user_interests')
      .insert(interests);

    if (interestsError) {
      console.error('Error logging interests:', interestsError);
      setErrorMessage('Failed to log interests. Please try again.');
    } else {
      // Redirect to dashboard
      navigate("/dashboard", { state: { selectedTopics, selectedSubtopics } });
    }
  };

  return (
    <div className="bg-gradient-to-r from-skyblue-500 via-white-500 to-royal-blue-500 flex justify-center items-center min-h-screen">
      <div className="bg-card border border-gray-400 shadow-lg rounded-lg p-6" style={{ width: '600px', minHeight: '500px' }}>
        <Progress className="mb-4" value={progress} />
        <h1 className="mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900">Welcome.</h1>
        <h2 className="mb-4 text-2xl font-normal text-gray-500">What makes you excited?</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <h2 className="mb-2 text-lg font-normal text-gray-500">Select up to 5 topics of interest.</h2>
            {topics.filter(topic => topic.topic_id >= 1 && topic.topic_id <= 10).map((topic, index) => (
              <div key={index} className="mb-4">
                <FormField
                  control={form.control}
                  name={`topic${index}`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                      <FormControl>
                        <Checkbox
                          checked={selectedTopics.includes(topic)}
                          onCheckedChange={() => {
                            handleCheckboxChange(topic);
                            field.onChange(!selectedTopics.includes(topic));
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {topic.topic_name}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                {selectedTopics.includes(topic) && (
                  <div className="ml-8 mt-2 flex flex-wrap">
                    {subtopics.filter(subtopic => subtopic.topic_id === topic.topic_id).map((subtopic) => (
                      <button
                        type="button"
                        key={subtopic.subtopic_id}
                        className={`m-1 px-2 py-1 rounded-full border ${selectedSubtopics.includes(subtopic) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                        onClick={() => handleSubtopicChange(subtopic)}
                      >
                        {subtopic.subtopic_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-4">
              <h2 className="mb-2 text-lg font-normal text-gray-500">Add up to 5 custom topics of interest.</h2>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={customTopicInput}
                  onChange={handleCustomTopicChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter custom topic"
                />
                <Button type="button" onClick={addCustomTopic} className="ml-2">Add</Button>
              </div>
              <div className="flex flex-wrap">
                {customTopics.map((customTopic, index) => (
                  <div key={index} className="flex items-center m-1 px-2 py-1 rounded-full border bg-gray-200 text-gray-800">
                    <span>{customTopic.topic_name}</span>
                    <button type="button" onClick={() => removeCustomTopic(index)} className="ml-2 text-red-500">x</button>
                  </div>
                ))}
              </div>
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <div className="flex items-center justify-between">
              <Button type="button" onClick={handleBack}>Back</Button>
              <Button type="submit">Next</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default OnboardingFive;
