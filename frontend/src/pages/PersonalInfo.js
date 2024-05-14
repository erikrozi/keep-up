import React, { useState, useEffect } from 'react';
import { Checkbox } from "../components/ui/checkbox.tsx"
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import ProgressBar from '../components/ui/progressbar.js';

import { Button } from "../components/ui/button.tsx"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "../components/ui/form.tsx"

function PersonalInfo() {
    const [progress, setProgress] = useState(0);
    const handleNextStep = () => {
        setProgress(prevProgress => Math.min(prevProgress + 25, 100));
    };

    const navigate = useNavigate();
    const form = useForm();
    const onSubmit = data => {
        navigate('/onboardingfive', { state: { data } });
    };

    return (
        <div className="bg-gradient-to-r from-skyblue-500 via-white-500 to-royal-blue-500 flex justify-center items-center min-h-screen">
            <div className="bg-card border border-gray-200 shadow-lg rounded-lg p-6">
                <h1 class="mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900">Welcome.</h1>
                <h2 class="mb-4 text-2xl font-normal text-gray-500">We'd like to get to know you a bit more.</h2>
                {/* <ProgressBar progress={progress} height="10px" color="#4CAF50" /> */}
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
                        <div className="flex items-center">
                            <Button type="submit">Next</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
        // </div >
    )
}

export default PersonalInfo;
