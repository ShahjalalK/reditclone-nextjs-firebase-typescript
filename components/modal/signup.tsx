import React, { useEffect, useState } from "react";
import HeaderModal from "./headerModal";
import AuthButton from "./authButton";
import { BsFillEyeFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { AiFillEyeInvisible } from "react-icons/ai";
import { Spinner } from "flowbite-react";
import { useSetRecoilState } from "recoil";
import { useAuthModalState } from "@/atoms/useAuthModalState";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, fireStore } from "@/firebase/firebaseConfig";
import { FIREBASEERRORS } from "@/firebase/errors";
import { addDoc, collection } from "firebase/firestore";

type Props = {};
type User = {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string;
  phoneNumber: string | null;
};

const Signup = (props: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const setModalState = useSetRecoilState(useAuthModalState);
  const [error, setError] = useState("");
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const ChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const SubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signupForm.confirmPassword !== signupForm.password) {
      setError("Password Don't Match");
      return;
    }
    const res = await createUserWithEmailAndPassword(
      signupForm.email,
      signupForm.password
    );

    if (res) {
      setModalState((prev) => ({
        ...prev,
        open: false,
      }));
    }
  };

  const createUserDocument = async (user: User) => {
    await addDoc(collection(fireStore, "users"), user);
    console.log(user);
  };

  useEffect(() => {
    if (userCred) {
      createUserDocument({
        displayName: userCred.user.displayName,
        email: userCred.user.email,
        photoURL: userCred.user.photoURL,
        uid: userCred.user.uid,
        phoneNumber: userCred.user.phoneNumber,
      });
    }
  }, [userCred]);

  console.log(userCred);

  return (
    <div className="p-5">
      <div>
        <HeaderModal title="Sign Up" />
      </div>
      <div className="my-5">
        <AuthButton />
      </div>
      <div className="my-5 justify-center  relative">
        <span className=" absolute w-[40%] h-[1px] bg-gray-200 top-[50%] left-[50%] -translate-x-[125%] z-0"></span>
        <span className=" flex justify-center items-center mx-auto uppercase text-center font-bold text-gray-400">
          OR
        </span>
        <span className=" absolute w-[40%] h-[1px] bg-gray-200 top-[50%] right-[50%] translate-x-[125%] z-0"></span>
      </div>
      <div>
        <form className="flex flex-col space-y-3" onSubmit={SubmitHandler}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MdEmail className="text-xl text-gray-500" />
            </div>
            <input
              type="email"
              id="email-address-icon"
              required
              name="email"
              onChange={ChangeHandler}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Your Email"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
              {showPassword ? (
                <AiFillEyeInvisible
                  className="text-xl text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <BsFillEyeFill
                  className="text-xl text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password-icon"
              name="password"
              required
              onChange={ChangeHandler}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-sm"
              placeholder="Password"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
              {showConfirmPassword ? (
                <AiFillEyeInvisible
                  className="text-xl text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              ) : (
                <BsFillEyeFill
                  className="text-xl text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              )}
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword-icon"
              name="confirmPassword"
              onChange={ChangeHandler}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-sm"
              placeholder="Confirm Password"
            />
          </div>
          <div className="text-red-600 text-sm">
            {error ||
              (userError && (
                <p>
                  {error ||
                    FIREBASEERRORS[
                      userError.message as keyof typeof FIREBASEERRORS
                    ]}
                </p>
              ))}
          </div>

          <div className="pt-5 w-full">
            <button
              type="submit"
              className="text-white w-full bg-reddit-orangered hover:bg-reddit-orange focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              {loading ? <Spinner /> : "Create a new account"}
            </button>
            <p className="text-sm my-3  ">
              Already a redditor?{" "}
              <span
                className="text-blue-700 cursor-pointer"
                onClick={() =>
                  setModalState((prev) => ({ ...prev, view: "login" }))
                }
              >
                Log In
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
