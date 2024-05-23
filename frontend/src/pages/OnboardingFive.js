import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Checkbox } from "../components/ui/checkbox.tsx";
import { useForm } from "react-hook-form";
import ProgressBar from '../components/ui/progressbar.js';
import { Button } from "../components/ui/button.tsx";
import useSupabaseUser from '../hooks/useSupabaseUser';

import { createClient } from "@supabase/supabase-js";


import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "../components/ui/form.tsx"

const supabase = createClient("https://jmrqzntxxgtbbuurhivj.supabase.co", 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptcnF6bnR4eGd0YmJ1dXJoaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MzI3NTcsImV4cCI6MjAzMTIwODc1N30.bnssrh3cwo41hAUb90XmVQT8iZNgWLEl-lzC7GUaQJQ");

function OnboardingFive() {
    const navigate = useNavigate();
    const form = useForm();

    const { user, loading, error } = useSupabaseUser();

    const [topics, setTopics] = useState([]);
    const [subtopics, setSubtopics] = useState([]);


    const [selectedTopics, setSelectedTopics] = useState([]);
    const [selectedSubtopics, setSelectedSubtopics] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');


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

    const onSubmit = () => {
        // Redirect to subtopic selection page with selected topics and subtopics
        navigate("/dashboard", { state: { selectedTopics, selectedSubtopics } });
    };

    return (
        <div className="bg-gradient-to-r from-skyblue-500 via-white-500 to-royal-blue-500 flex justify-center items-center min-h-screen">
            <div className="bg-card border border-gray-400 shadow-lg rounded-lg p-6">
                <h1 className="mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900">Welcome!</h1>
                <h2 className="mb-4 text-2xl font-normal text-gray-500">We'd like to get to know you a bit more.</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <h2 className="mb-2 text-lg font-normal text-gray-500">Select up to 5 topics of interest.</h2>
                        {topics.map((topic, index) => (
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
                                                key={subtopic}
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
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                        <div className="flex items-center">
                            <Button type="submit">Next</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default OnboardingFive;
