"use client";

import Link from "next/link";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { PiLockKeyThin } from "react-icons/pi";


import { useState } from "react";
import { TbCircleNumber1} from "react-icons/tb";
import { TiTick } from "react-icons/ti";
import Button from "@/app/components/Form/Button";
import Input from "@/app/components/Form/Input";

interface ModifierMdpProps {
    isLoading: boolean;
    setIsLoading: (val: boolean) => void;
    email:string
    setEmail:Function
    setPassword:Function
    setIsMotdepasseoublié:Function
    }
    
const ModifierMdp:React.FC<ModifierMdpProps>= ({
    isLoading,
    setIsLoading,
    email,
    setEmail,
    setPassword,
    setIsMotdepasseoublié
    }) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        } = useForm<FieldValues>({
        defaultValues: {
            email: "",
        },
        });


const [jsonData, setjsonData] = useState<any>(null);
const [password, setpassword] = useState("");
const [password1, setPassword1] = useState("");

const containsLowerAndUpper = (str:any) => {
    const lowerRegex = /[a-z]/;
    const upperRegex = /[A-Z]/;
    return lowerRegex.test(str) && upperRegex.test(str);
    };
    
const isValidPasswordLowerAndUpper = containsLowerAndUpper(password);

const containsDigit = (str:any) => {
    const digitRegex = /\d/;
    return digitRegex.test(str);
};
const isValidPasswordDigit = containsDigit(password);

const isValidPasswordlength = password.length >= 8;
const isPasswordValid = isValidPasswordLowerAndUpper && isValidPasswordDigit && isValidPasswordlength && password1 === password

const isButtonDisabled = !isPasswordValid;


const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    
    data.email = email
    console.log({email});
    setIsLoading(true);
    const { password1, ...result } = data;
    console.log({data})
    const res = await fetch("http://localhost:8000/backend/user/password/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
    });
    console.log({ res });
    const jsonData = await res.json();
    setjsonData(jsonData);
    console.log({ jsonData });
    if (jsonData.message === "success") {
        setEmail(email)
        setPassword(password)
        setIsMotdepasseoublié(false)
    }
    };
    

return (
<div>
<div className="p-2 text-sm flex gap-1 ">
        <TbCircleNumber1 size={25}  className="bg-black text-white rounded-full"/>
        <p className="pt-1">Réinitialiser mon mot de passe</p>
    </div>
    <Input
    id="password"
    required
    register={register}
    errors={errors}
    type="password"
    placeholder="Saisissez votre mot de passe"
    label="Password"
    value={password}
    onChange={(e:any) => setpassword(e.target.value)}
    Icon={PiLockKeyThin}
    />
    <Input
    id="password1"
    register={register}
    errors={errors}
    type="password"
    placeholder="Comfirmez votre mot de passe"
    value={password1}
    onChange={(e:any) => setPassword1(e.target.value)}
    Icon={PiLockKeyThin}
    />
    <div>
    {password1 !== "" && password1 !== password && (
        <p className="text-red-500">Les mots de passe ne correspondent pas</p>
    )}
    {password1 === password  && password.length >0 &&(
        <p className="text-green-500 px-4">Les mots de passe correspondent</p>
    )}{" "}
    {password && (
        <div>
        
        <p className={`text-${isValidPasswordLowerAndUpper ? 'green' : 'red'}-500 flex gap-1 px-4`}>
            <TiTick
            size={15}
            className="rounded-2xl border-[1px] border-black mt-1"
            />{" "}
            1 Minuscule & 1 Majuscule
        </p>
        <p className={`text-${isValidPasswordDigit ? 'green' : 'red'}-500 flex gap-1 px-4`}>
            <TiTick
            size={15}
            className="rounded-2xl border-[1px] border-black mt-1"
            />{" "}
            1 chiffre (0-9)
        </p>
        <p className={`text-${isValidPasswordlength ? 'green' : 'red'}-500 flex gap-1 px-4`}>
            <TiTick
            size={15}
            className="rounded-2xl border-[1px] border-black mt-1 text-green-500"
            />{" "}
            8 caractères
        </p>
        </div>
    )}

    {jsonData?.error && (
        <p className="text-red-500 px-2">{jsonData?.message}</p>
    )}
    </div>
    <Button
        label="réinitialisez votre mot de passe"
        onClick={handleSubmit(onSubmit)} 
        disabled={isButtonDisabled}
    />
        
</div> 

);
};

export default ModifierMdp;