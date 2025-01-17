import React, { useState, useEffect } from 'react';
import { Checkbox } from "../components/ui/checkbox.tsx"
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { Progress } from '../components/ui/progress.tsx';
import useSupabaseUser from '../hooks/useSupabaseUser';
import { supabase } from '../../src/utils/supabase.ts';

import { Button } from "../components/ui/button.tsx"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "../components/ui/form.tsx"

function PersonalInfo() {
    const navigate = useNavigate();
    const { user, loading, error } = useSupabaseUser();
    const [errorMessage, setErrorMessage] = useState('');
    const progress = 0; // Start of onboarding

    const form = useForm({
        defaultValues: {
            isStudent: false,
            isResearcher: false,
            isProfessional: false,
            goal1: false,
            goal2: false,
            goal3: false
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            const { data, error } = await supabase
                .from('user_info')
                .select('isstudent, isresearcher, isprofessional, goal1, goal2, goal3')
                .eq('user_id', user.id)
                .single();

            if (error) {
                console.error('Error fetching user info:', error);
            } else if (data) {
                form.reset({
                    isStudent: data.isstudent,
                    isResearcher: data.isresearcher,
                    isProfessional: data.isprofessional,
                    goal1: data.goal1,
                    goal2: data.goal2,
                    goal3: data.goal3
                });
            }
        };

        fetchData();
    }, [user]);

    const onSubmit = async (data) => {
        if (!user) {
            console.error('User is not logged in.');
            return;
        }
        try {
            const { error } = await supabase
                .from('user_info')
                .upsert({
                    user_id: user.id,
                    isstudent: data.isStudent,
                    isresearcher: data.isResearcher,
                    isprofessional: data.isProfessional,
                    goal1: data.goal1,
                    goal2: data.goal2,
                    goal3: data.goal3
                });

            if (error) {
                throw error;
            }
            navigate('/onboardingfive', { state: { data } });
        } catch (error) {
            console.error('Error logging interests:', error);
            setErrorMessage('Failed to log interests. Please try again.');
        }
    };

    return (
        <div className="bg-gradient-to-r from-skyblue-500 via-white-500 to-royal-blue-500 flex justify-center items-center min-h-screen">
            <div className="bg-card border border-gray-200 shadow-lg rounded-lg p-6" style={{ width: '600px', minHeight: '500px' }}>
                <Progress className="mb-4" value={progress} />
                <h1 class="mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900">Welcome.</h1>
                <h2 class="mb-4 text-2xl font-normal text-gray-500">We'd like to get to know you a bit more.</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <h2 class="mb-2 text-lg font-normal text-gray-500">What is your professional level?</h2>
                        <FormField
                            control={form.control}
                            name="isStudent"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Student
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isResearcher"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Researcher
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isProfessional"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Industry Professional
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        {/* <div className="bg-card border border-gray-200 shadow-lg rounded-lg p-6"> */}
                        <h2 class="mb-2 text-lg font-normal text-gray-500">What are your goals for using KeepUp?</h2>
                        <FormField
                            control={form.control}
                            name="goal1"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Explore my area of interest in-depth
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="goal2"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            See what's generally out there
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="goal3"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Have fun!
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit">Next</Button>
                        </div>
                    </form>
                </Form>
                {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            </div>
        </div>
    )
}

export default PersonalInfo;
