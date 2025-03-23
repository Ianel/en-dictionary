"use client";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";

type Phonetic = {
    text: string;
    audio: string;
};

type Definition = {
    definition: string;
    example?: string;
};

type Meaning = {
    partOfSpeech: string;
    definitions: Definition[];
    synonyms?: string[];
    antonyms?: string[];
};

type Word = {
    word: string;
    phonetics: Phonetic[];
    meanings: Meaning[];
    title?: string;
    message?: string;
};

const formSchema = z.object({
    searchTerm: z.string().nonempty({
        message: "You must provide a word",
    }),
});

export default function Home() {
    const [word, setWord] = useState<Word[]>([]);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            searchTerm: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);

        try {
            const response = await fetch(
                `https://api.dictionaryapi.dev/api/v2/entries/en/${values.searchTerm}`
            );

            if (!response.ok) {
                throw new Error("Word not found");
            }

            const singleWord: Word[] = await response.json();
            setWord(singleWord);
        } catch (error) {
            setWord([
                {
                    title: "No Definitions Found",
                    message: "The word you searched for could not be found.",
                    word: "",
                    phonetics: [],
                    meanings: [],
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 flex flex-col">
            <section className="flex flex-col text-center my-1 items-center gap-3">
                <h2 className="font-semibold">
                    Welcome to Words. Your #1 online English dictionary
                </h2>
                <p className="max-w-6xl">
                    You can type any valid English word and we will give you the
                    most accurate informations about the word you typed.
                    Mistakes are possible but we advise you to check physic
                    dictionaries if needed.
                </p>
            </section>
            <section className="mt-10 mx-auto w-full gap-3">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 flex flex-col w-full md:flex-row md:justify-center md:gap-3"
                    >
                        <FormField
                            control={form.control}
                            name="searchTerm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="search"
                                            className="w-full md:w-64"
                                            placeholder="Enter an english word"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            className="w-full md:w-auto cursor-pointer"
                            disabled={loading}
                            type="submit"
                        >
                            {loading ? (
                                <div className="w-4 h-4 rounded-full border-t-2 border-b-2 border-white animate-spin"></div>
                            ) : (
                                <>
                                    <Search /> Search
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </section>

            {form.getValues("searchTerm") === "" ? null : word[0]?.title ===
              "No Definitions Found" ? (
                <div className="flex flex-col items-center">
                    <Image
                        src={"/not-found.jpg"}
                        alt="Not found"
                        width={300}
                        height={300}
                    />
                    <h3 className="text-zinc-700">{word[0]?.message}</h3>
                </div>
            ) : (
                word.length > 0 && (
                    <>
                        <section className="mt-10 md:mt-5">
                            <section className="text-center">
                                <h3 className="font-semibold">
                                    {word[0]?.word}
                                </h3>
                            </section>
                            <section className="mt-5 flex flex-row justify-center gap-3 flex-wrap">
                                {word[0]?.phonetics
                                    ?.filter((son) => son.audio !== "")
                                    .map((aud, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col gap-3 w-full md:w-72"
                                        >
                                            <h4 className="font-semibold underline text-center">
                                                {aud.audio
                                                    .split("-")
                                                    .pop()
                                                    ?.split(".")[0]
                                                    ?.toUpperCase()}
                                            </h4>
                                            <h5 className="text-center">
                                                &quot;{aud.text}&quot;
                                            </h5>
                                            <audio
                                                className="w-full md:w-72"
                                                controls
                                                key={index}
                                                src={aud.audio}
                                            >
                                                Audio 1
                                            </audio>
                                        </div>
                                    ))}
                            </section>
                        </section>

                        <section className="mt-10 w-full max-w-6xl mx-auto">
                            <h3 className="font-semibold text-xl">Meanings</h3>
                            <section>
                                {word.map((w, index) => {
                                    return w["meanings"].map((m, index) => {
                                        return (
                                            <section
                                                key={index}
                                                className="mt-5"
                                            >
                                                <li className="font-semibold capitalize">
                                                    {m.partOfSpeech}
                                                </li>
                                                <Tabs
                                                    defaultValue="definitions"
                                                    className="mt-5 border border-gray-200 rounded-lg shadow-md"
                                                >
                                                    <TabsList className="flex w-full bg-gray-100 rounded-t-lg">
                                                        <TabsTrigger
                                                            value="definitions"
                                                            className="text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none "
                                                        >
                                                            Definitions
                                                        </TabsTrigger>
                                                        <TabsTrigger
                                                            value="synonyms"
                                                            className="text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none "
                                                        >
                                                            Synonyms
                                                        </TabsTrigger>
                                                        <TabsTrigger
                                                            value="antonyms"
                                                            className="text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none "
                                                        >
                                                            Antonyms
                                                        </TabsTrigger>
                                                        <TabsTrigger
                                                            value="examples"
                                                            className="text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none "
                                                        >
                                                            Examples
                                                        </TabsTrigger>
                                                    </TabsList>
                                                    <TabsContent
                                                        value="definitions"
                                                        className="p-5 bg-white rounded-b-lg"
                                                    >
                                                        {m.definitions.map(
                                                            (d, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="mb-4"
                                                                >
                                                                    <p className="text-gray-800 text-sm">
                                                                        <span className="font-semibold text-blue-600">
                                                                            -
                                                                        </span>{" "}
                                                                        {
                                                                            d.definition
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )
                                                        )}
                                                    </TabsContent>
                                                    <TabsContent
                                                        value="synonyms"
                                                        className="p-5 bg-white rounded-b-lg"
                                                    >
                                                        {m.synonyms &&
                                                        m.synonyms.length >
                                                            0 ? (
                                                            <ul className="list-disc list-inside text-gray-800">
                                                                {m.synonyms.map(
                                                                    (
                                                                        syn,
                                                                        index
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="text-sm"
                                                                        >
                                                                            {
                                                                                syn
                                                                            }
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-gray-500 text-sm">
                                                                No synonyms
                                                                available.
                                                            </p>
                                                        )}
                                                    </TabsContent>
                                                    <TabsContent
                                                        value="antonyms"
                                                        className="p-5 bg-white rounded-b-lg"
                                                    >
                                                        {m.antonyms &&
                                                        m.antonyms.length >
                                                            0 ? (
                                                            <ul className="list-disc list-inside text-gray-800">
                                                                {m.antonyms.map(
                                                                    (
                                                                        ant,
                                                                        index
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="text-sm"
                                                                        >
                                                                            {
                                                                                ant
                                                                            }
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-gray-500 text-sm">
                                                                No antonyms
                                                                available.
                                                            </p>
                                                        )}
                                                    </TabsContent>
                                                    <TabsContent
                                                        value="examples"
                                                        className="p-5 bg-white rounded-b-lg"
                                                    >
                                                        {m.definitions.some(
                                                            (d) => d.example
                                                        ) ? (
                                                            m.definitions.map(
                                                                (d, index) =>
                                                                    d.example && (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="mb-4"
                                                                        >
                                                                            <p className="text-gray-800 text-sm">
                                                                                <span className="font-semibold text-blue-600">
                                                                                    *
                                                                                </span>{" "}
                                                                                {
                                                                                    d.example
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    )
                                                            )
                                                        ) : (
                                                            <p className="text-gray-500 text-sm">
                                                                No examples
                                                                available.
                                                            </p>
                                                        )}
                                                    </TabsContent>
                                                </Tabs>
                                            </section>
                                        );
                                    });
                                })}
                            </section>
                        </section>
                    </>
                )
            )}
        </div>
    );
}
