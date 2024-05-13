import React, { useState, useEffect } from 'react';
import { Checkbox } from "../components/ui/checkbox.tsx"
import { useNavigate } from 'react-router-dom';
// import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
// import { z } from "zod"
import { Button } from "../components/ui/button.tsx"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "../components/ui/form.tsx"
import { toast } from "../components/ui/use-toast.ts"
import { query, collection, getDocs, where } from "firebase/firestore";
import { auth, db, logout } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function PersonalInfo() {
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);
    const [name, setName] = useState("");



    useEffect(() => {
        if (!user) return navigate("/");

        const fetchUserName = async () => {
            try {
                const q = query(collection(db, "users"), where("uid", "==", user?.uid));
                const doc = await getDocs(q);
                const data = doc.docs[0].data();
                setName(data.name);
            } catch (err) {
                console.error(err);
                alert("An error occured while fetching user data");
            }
        };

        fetchUserName();
    }, [user, navigate]);
    // const [selectedItems, setSelectedItems] = useState([]);

    // const form = useForm({
    //     resolver: zodResolver(),
    //     defaultValues: {
    //         mobile: true,
    //     },
    // })
    const form = useForm();


    // function onSubmit(data) {
    //     toast({
    //         title: "You submitted the following values:",
    //         description: (
    //             <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //                 <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //             </pre>
    //         ),
    //     })
    // }

    const onSubmit = data => {
        console.log(data);
    };

    return (
        <div className="bg-gradient-to-r from-skyblue-500 via-white-500 to-royal-blue-500 flex justify-center items-center min-h-screen">
            <div className="bg-card border border-gray-200 shadow-lg rounded-lg p-6">
                <h1 class="mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900">Welcome, {name}.</h1>
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
