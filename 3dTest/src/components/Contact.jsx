import React from "react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const EMAILJS_PUBLIC_KEY = "lHY2UieaKH4ipOugW";
const EMAILJS_SERVICE_ID = "service_f5986q7";
const EMAILJS_TEMPLATE_ID = "template_04inwhi";

// Initialize EmailJS once (recommended by docs)
if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

const Contact = () => {
  const formRef = useRef();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send both naming conventions so your template works with {{from_name}} OR {{user_name}}, etc.
      const templateParams = {
        from_name: form.name,
        to_name: "Mohammad",
        from_email: form.email,
        to_email: "shaweesh.mh@gmail.com",
        message: form.message,
        // Common alternative names used in EmailJS templates:
        user_name: form.name,
        user_email: form.email,
        reply_to: form.email,
      };
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );
      setLoading(false);
      alert("Thank you! I will get back to you as soon as possible.");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setLoading(false);
      const status = error?.status ?? "?";
      const text = error?.text ?? error?.message ?? String(error);
      console.error("EmailJS error:", { status, text, full: error });
      const isGmailReconnect =
        /invalid grant|reconnect your gmail/i.test(String(text));
      if (isGmailReconnect) {
        alert(
          "Email not sent: your Gmail connection in EmailJS has expired. Go to dashboard.emailjs.com → Email Services → your service → reconnect the Gmail account, then try again."
        );
      } else {
        alert(
          `Something went wrong (status: ${status}). Open DevTools (F12) → Console and look for "EmailJS error" to see the exact reason.`
        );
      }
    }
  };

  return (
    <div className="xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden">
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] bg-black-100 p-6 rounded-2xl"
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionContactText}>Contact.</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-2 flex flex-col gap-4"
        >
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="What's your name?"
              className="bg-tertiary py-4 px-6 palceholder:text-secondary text-white rounded-lg outlined-none border-none font-medium"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email?"
              className="bg-tertiary py-4 px-6 palceholder:text-secondary text-white rounded-lg outlined-none border-none font-medium"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Message</span>
            <textarea
              rows="5"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What do you want to say?"
              className="bg-tertiary py-4 px-6 palceholder:text-secondary text-white rounded-lg outlined-none border-none font-medium"
            />
          </label>

          <div className="flex justify-end ">
            <button
              type="submit"
              className="bg-tertiary py-3 px-8 outline-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
