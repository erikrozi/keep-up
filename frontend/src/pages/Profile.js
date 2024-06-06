import React, { useEffect, useState } from 'react';
import useSupabaseUser from '../hooks/useSupabaseUser';
import { supabase } from '../../src/utils/supabase.ts';
import { Button } from "../components/ui/button.tsx";

function Profile() {
    const { user, loading, error } = useSupabaseUser();
    const [userInfo, setUserInfo] = useState({ id: '', email: '' });
    const [fetchError, setFetchError] = useState(null);

    const [isStudent, setIsStudent] = useState(false);
    const [isResearcher, setIsResearcher] = useState(false);
    const [isProfessional, setIsProfessional] = useState(false);

    const [isGoal1, setGoal1] = useState(false);
    const [isGoal2, setGoal2] = useState(false);
    const [isGoal3, setGoal3] = useState(false);

    const [selectedTopics, setSelectedTopics] = useState([]);
    const [selectedSubtopics, setSelectedSubtopics] = useState([]);
    const [customTopics, setCustomTopics] = useState([]);

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (user) {
          getUserTopics(user.id);
          getUserSubtopics(user.id);
          getUserCustomTopics(user.id);
        }
    }, [user]);

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

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data: authData, error: authError } = await supabase.auth.getUser();
                if (authError) {
                    setFetchError(authError.message);
                    return;
                }

                const userId = authData.user?.id;
                if (!userId) {
                    throw new Error('Invalid user ID');
                }

                setUserInfo({
                    id: userId,
                    email: authData.user.email || 'Unknown' // Adjust based on your user metadata
                });

                // Fetch user roles based on the primary key (user ID)
                const { data: roleData, error: roleError } = await supabase
                    .from('user_info')
                    .select('isstudent, isresearcher, isprofessional, goal1, goal2, goal3')
                    .eq('user_id', userId)
                    .single();

                if (roleError) {
                    setFetchError(roleError.message);
                } else {
                    setIsStudent(roleData.isstudent);
                    setIsResearcher(roleData.isresearcher);
                    setIsProfessional(roleData.isprofessional);
                    setGoal1(roleData.goal1);
                    setGoal2(roleData.goal2);
                    setGoal3(roleData.goal3);
                }
            } catch (err) {
                setFetchError(err.message);
            }
        };

        if (user) {
            fetchUserData();
        }
    }, [user]);

    const renderTopicsWithSubtopics = () => {
        // Group subtopics by their parent topics
        const topicsWithSubtopics = selectedTopics.map(topic => ({
            ...topic,
            subtopics: selectedSubtopics.filter(subtopic => subtopic.topic_id === topic.topic_id)
        }));

        return (
            <div className="mb-4">
                {topicsWithSubtopics.map(topic => (
                    <div key={topic.topic_id} className="mb-2">
                        <span className="m-1 px-2 py-1 rounded-full border bg-gray-200 text-gray-800">
                            {topic.topic_name}
                        </span>
                        {topic.subtopics.length > 0 && (
                            <div className="ml-2 mt-1 flex flex-wrap"> {/* Adjusted margin */}
                                {topic.subtopics.map(subtopic => (
                                    <span key={subtopic.subtopic_id} className="m-1 px-2 py-1 rounded-full border bg-gray-200 text-gray-800">
                                        {subtopic.subtopic_name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderRoles = () => {
        const roles = [];
        if (isStudent) roles.push('Student');
        if (isResearcher) roles.push('Researcher');
        if (isProfessional) roles.push('Professional');

        return (
            <div className="flex flex-wrap mb-4">
                {roles.map((role, index) => (
                    <span key={index} className="m-1 px-2 py-1 rounded-full border bg-gray-200 text-gray-800">
                        {role}
                    </span>
                ))}
            </div>
        );
    };

    const renderGoals = () => {
        const goals = [];
        if (isGoal1) goals.push('Explore my area of interest in-depth');
        if (isGoal2) goals.push('See what is generally out there');
        if (isGoal3) goals.push('Have fun!');

        return (
            <div className="flex flex-wrap mb-4">
                {goals.map((goal, index) => (
                    <span key={index} className="m-1 px-2 py-1 rounded-full border bg-gray-200 text-gray-800">
                        {goal}
                    </span>
                ))}
            </div>
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error || fetchError) {
        return <div>Error: {error ? error.message : fetchError}</div>;
    }

    return (
        <div className="bg-gradient-to-r from-skyblue-500 via-white-500 to-royal-blue-500 flex justify-center items-center min-h-screen">
            <div className="bg-card border border-gray-200 shadow-lg rounded-lg p-6">
                <h1 className="mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900">Welcome!</h1>
                <h2 className="mb-4 text-2xl font-semibold leading-none tracking-tight text-gray-900">Email: {userInfo.email}</h2>

                <h2 className="mb-4 text-2xl leading-none tracking-tight text-gray-900">Your Roles:</h2>
                {renderRoles()}

                <h2 className="mb-4 text-2xl leading-none tracking-tight text-gray-900">Your Goals:</h2>
                {renderGoals()}

                <div className="text-center"> 
                    <Button type="button" onClick={() => alert("hello")} className="mt-4">Edit Roles and Goals</Button> 
                </div>

                <h2 className="mb-4 text-2xl leading-none tracking-tight text-gray-900"></h2>

                <h2 className="mb-4 text-2xl leading-none tracking-tight text-gray-900">Your Topics and Subtopics:</h2>
                {renderTopicsWithSubtopics()}

                <h2 className="mb-4 text-2xl leading-none tracking-tight text-gray-900">Your Custom Topics:</h2>
                <div className="mb-4">
                    {customTopics.map(customTopic => (
                        <span key={customTopic.topic_id} className="m-1 px-2 py-1 rounded-full border bg-gray-200 text-gray-800">
                            {customTopic.topic_name}
                        </span>
                    ))}
                </div>

                <div className="text-center"> 
                    <Button type="button" onClick={() => alert("hello")} className="mt-4">Edit Interests</Button> 
                </div> 
            </div>
        </div>
    );
}

export default Profile;
