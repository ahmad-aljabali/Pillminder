import { IonAccordion, IonAccordionGroup, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonInput, IonItem, IonLabel, IonModal, IonPage, IonText, IonTitle, IonToggle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import React from 'react';
import { CapacitorHttp } from '@capacitor/core';
import { io } from "socket.io-client";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

let operationType = "1";
let name = "Heart Medication";
let slot = "2"

const Settings: React.FC = () => {
    let contents = {
        "IP":"192.168.39.12",
        "Mealtimes":[]
    }

    const saveUserData = async () => {
        console.log("starting to write file");
        contents.IP = document.getElementById("IP").value;
        try{
            await Filesystem.writeFile({
                path: '/Settings.json',
                data: JSON.stringify(contents),
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            console.log("done"); 
        }catch{
            console.log("failed");
        }
    };

    useIonViewWillEnter(async () => {
        try{
            let file = await Filesystem.readFile({
            path: '/Settings.json',
            directory: Directory.Data,
            encoding: Encoding.UTF8,
            });
            contents = JSON.parse(file.data)
            console.log(contents);
            document.getElementById("IP").value = contents.IP;
        } catch{
            console.log("No custome user data saved");
            
        }
    });

    const sendTreatmentFunc = async (event:any) => {
        event.preventDefault();

        if(document.getElementById("IP").value){
            contents.IP = document.getElementById("IP").value;
        }

        if(document.getElementById("Type").value){
            operationType = document.getElementById("Type").value;
        }

        if(document.getElementById("Name").value){     
            name = document.getElementById("Name").value;
        }

        if(document.getElementById("Slot").value){
            slot = document.getElementById("Slot").value;
        }

        const options = {
            url: ("http://"+contents.IP+"/?type="+operationType+"$name="+name+"&slot="+slot+"%20").replace(" ","-"),
            headers: { 'Header': 'Value' },
        };

        CapacitorHttp.get(options);
    }


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot='start'>
                        <IonBackButton defaultHref='/main/prescriptions'></IonBackButton>
                    </IonButtons>
                    <IonTitle>Settings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonCard>
                    <IonCardContent>
                        
                        <form onSubmit={saveUserData}>
                            <IonInput  id='IP' label='IP' value={contents.IP} type='text' labelPlacement='floating' placeholder='e.g. Heart medicine' fill='outline'></IonInput>

                            <IonButton type='submit' expand='block' color='success' className='ion-margin-top' >Save</IonButton>

                            <IonAccordionGroup className='ion-margine-top'>
                                <IonAccordion value="Debuging" className='ion-no-padding'>
                                    <IonItem slot='header' className='ion-no-padding'>
                                        <IonLabel className='ion-padding-horizontal'>Debuging</IonLabel>
                                    </IonItem>

                                    <div slot='content'>
                                        <IonInput  id='Type' label='Type' value={operationType} type='text' labelPlacement='floating' className='ion-margin-top' fill='outline'></IonInput>
                                        <IonInput  id='Name' label='Name' value={name} type='text' labelPlacement='floating' className='ion-margin-top' fill='outline'></IonInput>
                                        <IonInput  id='Slot' label='Slot' value={slot} type='text' labelPlacement='floating' className='ion-margin-top' fill='outline'></IonInput>
                                        <IonButton onClick={sendTreatmentFunc} expand='block' color='primary' className='ion-margin-top' >Send</IonButton>
                                    </div>
                                </IonAccordion>
                            </IonAccordionGroup>
                        </form>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Settings;