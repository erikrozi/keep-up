import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "../components/ui/checkbox.tsx";
import { useForm } from "react-hook-form";
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

function EditInterests() {
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
    if (user) {
      getUserTopics(user.id);
      getUserSubtopics(user.id);
      getUserCustomTopics(user.id);
    }
  }, [user]);

  async function getTopics() {
    const { data } = await supabase.from("topics").select("topic_id, topic_name");
    setTopics(data);
  }

  async function getSubtopics() {
    const { data } = await supabase.from("subtopics").select("subtopic_id, topic_id, subtopic_name");
    setSubtopics(data);
  }

  async function getUserTopics(userId) {
    // Get topics with topic id <= 10
    const { data: userInterestsData, error } = await supabase
      .from("user_interests")
      .select("topic_id, topics (topic_name)")
      .eq("user_id", userId)
      .is("subtopic_id", null)
      .gte("topic_id", 1)
      .lte("topic_id", 10);

    if (error) {
      console.error("Error fetching user interests:", error);
      setErrorMessage('Failed to fetch user interests. Please try again.');
      return;
    }

    if (userInterestsData) {
      const selectedTopicsData = userInterestsData.map(interest => ({
        topic_id: interest.topic_id,
        topic_name: interest.topics.topic_name
      }));

      setSelectedTopics(selectedTopicsData);
    }
  }

  async function getUserSubtopics(userId) {
    const { data: userSubinterestsData, error } = await supabase
      .from("user_interests")
      .select(`
        topic_id,
        subtopic_id,
        subtopics (subtopic_name)
      `)
      .eq("user_id", userId)
      .not("subtopic_id", "is", null);

    if (error) {
      console.error("Error fetching user subinterests:", error);
      setErrorMessage('Failed to fetch user subinterests. Please try again.');
      return;
    }

    if (userSubinterestsData) {
      const selectedSubtopicsData = userSubinterestsData.map(interest => ({
        topic_id: interest.topic_id,
        subtopic_id: interest.subtopic_id,
        subtopic_name: interest.subtopics.subtopic_name
      }));

      setSelectedSubtopics(selectedSubtopicsData);
    } 
  }


  async function getUserCustomTopics(userId) {
    const { data: userCustomInterestsData, error } = await supabase
      .from("user_interests")
      .select(`
        topic_id,
        topics (topic_name)
      `)
      .eq("user_id", userId)
      .gt("topic_id", 10);

    if (error) {
      console.error("Error fetching user custom interests:", error);
      setErrorMessage('Failed to fetch user custom interests. Please try again.');
      return;
    }

    if (userCustomInterestsData) {
      const selectedCustomTopicsData = userCustomInterestsData.map(interest => ({
        topic_id: interest.topic_id,
        topic_name: interest.topics.topic_name
      }));

      setCustomTopics(selectedCustomTopicsData);
    }
  }


















  const handleSave = () => {
    navigate('/profile'); // Go to profile
  };

  const handleCheckboxChange = (topic) => {
    const isSelected = selectedTopics.some(selected => selected.topic_id === topic.topic_id);
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
    const isSelected = selectedSubtopics.some(selected => selected.subtopic_id === subtopic.subtopic_id);
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
    
    // Check if the custom topic already exists
    if (customTopics.some(topic => topic.topic_name === customTopicInput.trim())) {
      setErrorMessage('Custom topic already exists.');
      return;
    }

    // Check if the maximum limit of custom topics has been reached
    if (customTopics.length >= 5) {
      setErrorMessage('You can only add up to 5 custom topics.');
      return;
    }
    
    // Add the custom topic
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

  const userId = user.id;
  const interests = [];

  // Prepare interests for existing topics and subtopics
  selectedTopics.forEach((topic) => {
    interests.push({
      user_id: userId,
      topic_id: topic.topic_id,
    });
    selectedSubtopics.forEach((subtopic) => {
      if (subtopic.topic_id === topic.topic_id) {
        interests.push({
          user_id: userId,
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
      user_id: userId,
      topic_id: topicId,
    });
  }

  // Fetch the existing interests from the database
  const { data: existingInterests, error: fetchInterestsError } = await supabase
    .from('user_interests')
    .select('id, topic_id, subtopic_id')
    .eq('user_id', userId);

  if (fetchInterestsError) {
    console.error('Error fetching existing interests:', fetchInterestsError);
    setErrorMessage('Failed to fetch existing interests. Please try again.');
    return;
  }


  // Identify interests to be removed
  const interestsToRemove = existingInterests.filter(existingInterest => {
    const isNonCustomTopic = !existingInterest.subtopic_id && existingInterest.topic_id <= 10;
    const isCustomTopic = !existingInterest.subtopic_id && existingInterest.topic_id > 10;
    if (isNonCustomTopic) {
      return !selectedTopics.some(selectedTopic => selectedTopic.topic_id === existingInterest.topic_id);
    } 
    else if (isCustomTopic) {
      return !customTopics.some(customTopic => customTopic.topic_id === existingInterest.topic_id);
    }
    else {
      return !selectedSubtopics.some(selectedSubtopic => selectedSubtopic.subtopic_id === existingInterest.subtopic_id);
    }
  });

  // Remove outdated interests
  const { error: deleteError } = await supabase
    .from('user_interests')
    .delete()
    .in('id', interestsToRemove.map(interest => interest.id));

  if (deleteError) {
    console.error('Error removing outdated interests:', deleteError);
    setErrorMessage('Failed to remove outdated interests. Please try again.');
    return;
  }

  // Identify interests that already exist
  const existingInterestIds = existingInterests.map(interest => ({
    topic_id: interest.topic_id,
    subtopic_id: interest.subtopic_id
  }));

  // Filter out interests that already exist
  const newInterests = interests.filter(interest => {
    const existingInterestIndex = existingInterestIds.findIndex(existingInterest =>
      existingInterest.topic_id === interest.topic_id &&
      (!interest.subtopic_id || existingInterest.subtopic_id === interest.subtopic_id)
    );
    return existingInterestIndex === -1;
  });

  // Insert only new interests
  const { error: insertError } = await supabase
    .from('user_interests')
    .insert(newInterests);

  if (insertError) {
    console.error('Error logging interests:', insertError);
    setErrorMessage('Failed to log interests. Please try again.');
  } else {
    // Redirect to profile
    navigate("/profile", { state: { selectedTopics, selectedSubtopics } });
  }
};




























  return (
    <div className="bg-gradient-to-r from-skyblue-500 via-white-500 to-royal-blue-500 flex justify-center items-center min-h-screen">
      <div className="bg-card border border-gray-400 shadow-lg rounded-lg p-6" style={{ width: '600px', minHeight: '500px' }}>
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
                          checked={selectedTopics.some(selected => selected.topic_id === topic.topic_id)}
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
                {selectedTopics.some(selected => selected.topic_id === topic.topic_id) && (
                  <div className="ml-8 mt-2 flex flex-wrap">
                    {subtopics.filter(subtopic => subtopic.topic_id === topic.topic_id).map((subtopic) => (
                      <button
                        type="button"
                        key={subtopic.subtopic_id}
                        className={`m-1 px-2 py-1 rounded-full border ${selectedSubtopics.some(selected => selected.subtopic_id === subtopic.subtopic_id)? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
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
            <div className="text-center">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default EditInterests;


