"use client";

import Link from "next/link";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { PiLockKeyThin } from "react-icons/pi";

import { useState } from "react";
import { TbCircleNumber1, TbCircleNumber2 } from "react-icons/tb";
import { IoIosPhonePortrait } from "react-icons/io";
import Input from "@/app/components/Form/Input";
import Button from "@/app/components/Form/Button";
import ModifierMdp from "./ModifierMdp";

import "./style.css";
import React from "react";

interface MotdepasseoubliéProps {
isLoading: boolean;
setIsLoading: (val: boolean) => void;
setemail: (val: string) => void;
handleSignUpClick: () => void;
setPassword: (val: string) => void;
setIsMotdepasseoublié:Function;
setCanReturn:Function
}

const Motdepasseoublié: React.FC<MotdepasseoubliéProps> = ({
isLoading,
setIsLoading,
handleSignUpClick,
setPassword,
setemail,
setIsMotdepasseoublié,
setCanReturn
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
    
    const {
        register: registerSMS,
        handleSubmit: handleSubmitSMS,
        formState: { errors: errorsSMS },
        } = useForm<FieldValues>({
        defaultValues: {
            télephone: "",
        },
    });

//const [isLoading,setIsLoading] = useState(false)
const [inputcode, setInputCode] = useState();
const [codeEnvoyé, setCodeEnvoyé] = useState(false);
const [codeVrai, setCodeVrai] = useState(false);
const [codeFalse, setCodeFalse] = useState(false);
const [code, setCode] = useState("");
const [Email, setEmail] = useState("");
const [isPassword, setIsPassword] = useState("");
const [sms, setSms] = useState(false);
const [telephone, setTelephone] = useState("");


const [jsonData, setjsonData] = useState<any>(null);
function genererCode(): string {
let code = "";
for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10).toString();
}
return code;
}

const handleVerifCode = (inputcode: any) => {
if (code === inputcode) {
    setCodeVrai(true);
    console.log("code vrai");
} else {
    setCodeFalse(true);
    console.log("code eroné");
}
};

let email = "";
let pass = "";

const onSubmitSMS: SubmitHandler<FieldValues> = async (data) => {

    console.log({data});

    // pass = data.password;
    // setIsPassword(pass);
    // setPassword(isPassword);
    setTelephone(data.télephone)
    const code = genererCode();
    setCode(code);
    setIsLoading(true);
    const res = await fetch("http://localhost:8000/backend/user/send_SMS", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({  
                phoneNumber: data.télephone,
                message: `Pour réinitialiser votre mot de passe, merci de copier le code suivant:${code}`,
        }),
});
console.log({ res });
const jsonData = await res.json();
setjsonData(jsonData);
console.log({ jsonData });
if (jsonData.message === "Message envoyé avec succès") {
setEmail(jsonData.email)
setemail(jsonData.email);
console.log("ccc");
setCodeEnvoyé(true);
}
};

const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        email = data.email;
        setEmail(email);
        setemail(email);

        pass = data.password;
        setIsPassword(pass);
        setPassword(isPassword);
        const code = genererCode();
        setCode(code);
        setIsLoading(true);
        const res = await fetch("http://localhost:8000/backend/user/send-email/1", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            to: data.email,
            subject: "Réinitialisation du mot de passe",
            text: `Bonjour Vous avez demandé récemment à réinitialiser  le mot de passe de votre compte sur  www.commande-pizzatime.fr. Pour réinitialiser votre mot de passe, merci de copier le code suivant: ${code} Cordialement, `,
            }),
});
console.log({ res });
const jsonData = await res.json();
setjsonData(jsonData);
console.log({ jsonData });
if (jsonData.message === "Email envoyé avec succès") {
    console.log("ccc");
    setCodeEnvoyé(true);
}
};
React.useEffect(()=>{
    setCanReturn(true)
},[])
return (
<>
    <div className="flex gap-2 p-4 items-center justify-center">
    <button
        type="button"
        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
        onClick={() => {setSms(false) }}
    >
        Email
    </button>
    <button
        type="button"
        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
        onClick={() =>{setSms(true)}}
    >
        SMS
    </button>
    </div>
    {!codeVrai ? (
    <div className="p-2">
        {sms ? 
        <>
        <p className="text-sm">
        Pas d'inquiétude, nous allons vous envoyer le code de validation à
        sms sur ce numéro suivante :
        </p>
        <div className="p-2 text-sm flex gap-1 ">
        <TbCircleNumber1
            size={25}
            className="bg-black text-white rounded-full"
        />
        <p className="pt-1">Réinitialiser mon mot de passe</p>
        </div>
        <Input
        id="télephone"
        required
        register={registerSMS}
        errors={errorsSMS}
        type="text"
        placeholder="Saisissez votre télephone"
        label="Télephone"
        Icon={IoIosPhonePortrait}
        />
        {codeEnvoyé && (
        <p className="text-green-500 p-1">
            Votre code a été envoyé avec succès
        </p>
        )}
        <div className="p-2 ">
        <Button
            label={isLoading ? "Loading" : "Je réinitialise mon mot de passe"}
            onClick={handleSubmitSMS(onSubmitSMS)}
        />
        {jsonData?.message === "compte inexistant" && (
            <div>
            <p className="text-md text-red-500 p-1">
                Vous n'avez pas un compte creer un nouveau
            </p>
            <button
                onClick={handleSignUpClick}
                className="underline text-center"
            >
                Inscription
            </button>
            </div>
        )}
        </div>
        </>
        :
        <>
        <p className="text-sm">
        Pas d'inquiétude, nous allons vous envoyer le code de validation à
        l'adresse suivante :
        </p>
        <div className="p-2 text-sm flex gap-1 ">
        <TbCircleNumber1
            size={25}
            className="bg-black text-white rounded-full"
        />
        <p className="pt-1">Réinitialiser mon mot de passe</p>
        </div>
        <Input
        id="email"
        required
        register={register}
        errors={errors}
        type="email"
        placeholder="Saisissez votre e-mail"
        label="E-mail"
        Icon={MdOutlineMarkEmailRead}
        />
        {codeEnvoyé && (
        <p className="text-green-500 p-1">
            Votre code a été envoyé avec succès
        </p>
        )}
        <div className="p-2 ">
        <Button
            label={isLoading ? "Loading" : "Je réinitialise mon mot de passe"}
            onClick={handleSubmit(onSubmit)}
        />
        {jsonData?.message === "compte inexistant" && (
            <div>
            <p className="text-md text-red-500 p-1">
                Vous n'avez pas un compte creer un nouveau
            </p>
            <button
                onClick={handleSignUpClick}
                className="underline text-center"
            >
                Inscription
            </button>
            </div>
        )}
        </div>
        </>
        }


        <div>
        <p className="p-2  text-sm ">
            Merci de vérifier vos courriers indésirables après avoir cliqué
            sur " je réinitialise mon mot de passe".
        </p>
        <div className="p-2 text-sm flex gap-1 ">
            <TbCircleNumber2
            size={25}
            className="bg-black text-white rounded-full"
            />
            <p className="pt-1">Confirmer le code</p>
        </div>
        <div className="flex relative gap-0 h-full">
            <PiLockKeyThin
            size={30}
            className="absolute border-slate-200 p-1 mt-3"
            />
            <input
            required
            type="text"
            placeholder="Saisissez votre code"
            onChange={(e: any) => setInputCode(e.target.value)}
            className={` border-b-[2px] border-b-gray-200 pl-8 text-m w-full p-4 text-gray-500 mb-4 border-slate-300 `}
            />
        </div>
        {codeFalse && <p className="text-rose-400">Verifier votre code</p>}
        <div className="p-2 ">
            <Button
            label="Valider le code"
            onClick={() => handleVerifCode(inputcode)}
            />
        </div>
        </div>
    </div>
    ) : (
    <ModifierMdp
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        email={Email}
        setEmail={setEmail}
        setPassword={setPassword}
        telephone={telephone}
        setIsMotdepasseoublié={setIsMotdepasseoublié}
        setCanReturn={setCanReturn}
    />
    )}
</>
);
};

export default Motdepasseoublié;