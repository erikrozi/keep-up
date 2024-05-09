import React, { useState } from 'react';
import { Checkbox } from "../components/ui/checkbox.tsx"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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

function PersonalInfo() {
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
        <div className="bg-royal-blue-300 min-h-screen">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="hello"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
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
                        name="hello"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Use different settings for my mobile devices
                                    </FormLabel>
                                    {/* <FormDescription>
                                    Hello.
                                </FormDescription> */}
                                </div>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div >
    )
    // const [professionalLevel, setProfessionalLevel] = useState({
    //     levelA: false,
    //     levelB: false,
    //     levelC: false
    // });

    // const [goals, setGoals] = useState({
    //     goalA: false,
    //     goalB: false,
    //     goalC: false
    // });

    // // Handle professional level checkbox changes
    // const handleProfessionalChange = (event) => {
    //     setProfessionalLevel(prev => ({
    //         ...prev,
    //         [event.target.name]: event.target.checked
    //     }));
    //     console.log("checked");
    // };

    // // Handle goals checkbox changes
    // const handleGoalsChange = (event) => {
    //     setGoals(prev => ({
    //         ...prev,
    //         [event.target.name]: event.target.checked
    //     }));
    //     console.log("checked");
    // };

    // return (
    //     <div className="bg-royal-blue-300 min-h-screen">
    //         <h2>What is your professional level?</h2>
    //         <div>
    //             <div className="flex items-center space-x-2">
    //                 <Checkbox />
    //                 <label
    //                     className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    //                 >
    //                     Student
    //                 </label>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //                 <Checkbox />
    //                 <label
    //                     className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    //                 >
    //                     Researcher
    //                 </label>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //                 <Checkbox />
    //                 <label
    //                     className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    //                 >
    //                     Industry Professional
    //                 </label>
    //             </div>
    //         </div>

    //         <h2>What are your goals for using KeepUp?</h2>
    //         <div>
    //             <div className="flex items-center space-x-2">
    //                 <Checkbox />
    //                 <label
    //                     className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    //                 >
    //                     Explore fields of interest in depth
    //                 </label>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //                 <Checkbox />
    //                 <label
    //                     className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    //                 >
    //                     Generally explore what's out there
    //                 </label>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //                 <Checkbox />
    //                 <label
    //                     className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    //                 >
    //                     Have fun!
    //                 </label>
    //             </div>
    //         </div>
    //     </div>
    // );
}

export default PersonalInfo;
