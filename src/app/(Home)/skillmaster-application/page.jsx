"use client";

import BackgroundPattern from "@/components/background-pattern";
import { createSkillmasterApplication } from "@/lib/actions/skillmasters-action";
import { fetchCurrentUser } from "@/lib/actions/user-actions";
import { useUserStore } from "@/store/use-user";
import { Field, Input, Label } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiLoader, BiUpload } from "react-icons/bi";
import { IoMdAdd, IoMdClose, IoMdRemove } from "react-icons/io";

const SkillmasterApplicationPage = () => {
  const router = useRouter();
  const { user, userToken, setUser, removeToken } = useUserStore();
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    if (user) {
      setName(user?.gamer_tag || user?.first_name);
      setEmail(user.email);
    }
  }, [user]);

  // Function to fetch and verify the current user
  const handleUserFetch = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchCurrentUser();
      if (response?.error) {
        toast.error(response.error);

        await removeToken();
        router.push("/login");
      } else {
        setUser(response);
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while fetching the user.");

      await removeToken();
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router, setUser, removeToken]);

  useEffect(() => {
    if (!userToken) {
      toast.error("Need to login first!");
      setLoading(false);
      router.push("/login");
    }

    handleUserFetch();
  }, [userToken, handleUserFetch, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message || !images.length) {
      toast.error("Please fill in all the required fields");
      return;
    }

    if (channels.length < 1 || channels.some((channel) => !channel)) {
      toast.error("Please add at least one channel");
      return;
    }

    setLoading(true);

    try {
      const response = await createSkillmasterApplication(
        name,
        email,
        message,
        images,
        channels
      );

      if (response?.error) {
        router.push("/");
        toast.error(response.error);
      } else {
        toast.success("Application submitted successfully!");
        router.push("/");
      }
    } catch (err) {
      router.push("/");
      toast.error(
        err.message || "An error occurred while submitting the application."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeChannel = (index) => {
    setChannels(channels.filter((_, i) => i !== index));
  };

  const addChannel = () => {
    if (channels[channels.length - 1] !== "") {
      setChannels([...channels, ""]);
    } else {
      toast.error(
        "Please fill in the current channel before adding a new one."
      );
    }
  };

  const handleChannelChange = (index, value) => {
    const updatedChannels = [...channels];
    updatedChannels[index] = value;

    // Prevent empty strings from being added
    if (value.trim() !== "" || index < updatedChannels.length - 1) {
      setChannels(updatedChannels);
    }
  };

  // Handle the loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <BiLoader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 max-w-[1920px] mx-auto min-h-[96vh] space-y-6 p-4 flex items-center justify-center">
      {/* Background */}
      <BackgroundPattern />

      <div className="flex-col relative w-full">
        <p className="text-center text-xl font-bold">
          Application to become a Skillmaster
        </p>

        <div className="space-y-6">
          <Image
            src="/skillmasters/award.png"
            alt="award"
            width={150}
            height={150}
            priority
            className="absolute -top-20 left-0 lg:block hidden opacity-80"
          />
          <Image
            src="/skillmasters/charge.png"
            alt="charge"
            width={150}
            height={150}
            priority
            className="absolute bottom-0 right-0 lg:block hidden opacity-80"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 mt-6 max-w-2xl mx-auto bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-semibold text-white">
              Your Gamer Tag
            </label>
            <input
              type="text"
              id="name"
              required
              className="input-field"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="input-field"
              placeholder="Enter your email"
              value={email}
              disabled
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="font-semibold text-white">
              Reason for joining
            </label>
            <textarea
              id="message"
              className="bg-white/10 p-2 rounded-lg border border-white/10 hover:border-white/20"
              placeholder="Enter your message"
              value={message}
              required
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Images */}
          <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
            <Label className="font-semibold text-white">
              Proof of skills (max 3MB combined)
            </Label>
            <div className="flex flex-wrap gap-4">
              {images.length > 0 &&
                images.map((image, index) => (
                  <div
                    key={index}
                    className="group relative cursor-pointer flex-1 min-w-[200px]"
                  >
                    <Image
                      src={image}
                      alt="Product image"
                      width={200}
                      height={200}
                      priority
                      className="rounded-lg bg-white/10 p-2 h-full w-full object-cover min-w-[200px] max-h-[200px]"
                    />
                    <IoMdClose
                      className="h-8 w-8 group-hover:opacity-100 opacity-0 absolute top-0 right-0 p-2 m-2 hover:bg-black rounded-lg border border-white/10 bg-black/80"
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== index))
                      }
                    />
                  </div>
                ))}

              <div className="flex flex-col gap-2 flex-1 min-w-fit">
                <label
                  htmlFor="dropzone-file"
                  className="relative flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-800/10 border-gray-600 hover:border-gray-500"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <BiUpload className="h-8 w-8 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      Click or drag and drop your image here
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    accept="image/*"
                    className="absolute border h-full w-full opacity-0"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImages([...images, reader.result]);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </Field>

          {/* channels */}
          {/* channel List with Add and Remove Buttons */}
          <Field className="space-y-4 w-full border border-white/10 rounded-lg p-4 bg-white/5 hover:border-white/20">
            <div className="flex items-center justify-between gap-4">
              <Label>Channels</Label>
              <button
                type="button"
                onClick={addChannel}
                className="p-2 rounded-lg hover:bg-white/10 flex gap-2 items-center border border-white/10"
              >
                <IoMdAdd className="h-5 w-5" />
                Add more links
              </button>
            </div>

            {channels?.map((channel, index) => (
              <div key={index} className="flex flex-wrap gap-2 items-center">
                <Input
                  type="text"
                  value={channel || ""}
                  placeholder={`Link ${index + 1}`}
                  className="input-field"
                  onChange={(e) => handleChannelChange(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeChannel(index)}
                  className="border rounded-lg p-2 hover:bg-white/10 border-white/10"
                >
                  <IoMdRemove className="h-6 w-6" />
                </button>
              </div>
            ))}
          </Field>

          <button
            type="submit"
            className="bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20 flex-1 w-full disabled:gray-500/20"
          >
            Submit
          </button>
        </form>

        <p className="text-xs text-center mt-4">
          By submitting this form, you agree to the{" "}
          <Link
            href="/terms#skillmaster-term"
            target="_blank"
            rel="noreferrer"
            className="text-Gold hover:underline"
          >
            Terms of Service
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default SkillmasterApplicationPage;
