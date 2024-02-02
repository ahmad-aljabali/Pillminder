import { IonAccordion, IonAccordionGroup, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToggle, IonToolbar, useIonRouter } from '@ionic/react';
import React, { useState } from 'react';
import { bandageOutline, eyedropOutline, beakerOutline, waterOutline } from 'ionicons/icons';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Camera, CameraResultType } from '@capacitor/camera';

const iconList = {"Pills":bandageOutline,"Tablets":bandageOutline,"Syringes":eyedropOutline,"Syrup":beakerOutline, "Drops":waterOutline}

const AddTreatment: React.FC = () => {

    const router = useIonRouter();

    const saveUserData = async (userdata, newTreatment) => {
        console.log("starting to write file");

        userdata.Treatments.push(newTreatment)
        userdata.IDindex++
        
        console.log(userdata);
        try{
            await Filesystem.writeFile({
                path: '/OngoingTreatments.json',
                data: JSON.stringify(userdata),
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            console.log("done"); 
        }catch{
            console.log("failed");
        }
    };

    const readUserData = async () => {
        try{
            let contents = await Filesystem.readFile({
            path: '/OngoingTreatments.json',
            directory: Directory.Data,
            encoding: Encoding.UTF8,
            });
            return JSON.parse(contents.data)
        } catch{
            let contents = {"data":{
                "IDindex":0,
                "Treatments":[]
            }}
            return contents.data
        }
    };

    const deleteUserData = async () => {
        try{
            await Filesystem.deleteFile({
            path: '/OngoingTreatments.json',
            directory: Directory.Data,
            });
            console.log("file deleted");
        }catch{
            console.log("file doesn't exist");            
        }
        
    };

    const addTreatmentFunc = async (event: any) => {
        event.preventDefault();
        let userdata = await readUserData()

        let startDate = null; 
        let endDate = null;

        let dispenserSlot = null; 
        let restockDays = null; 
        let prescriptionDays = null; 

        if(document.getElementById("StartDateTime").value){
            console.log("Start date & time set");
            startDate = document.getElementById("StartDateTime").value;
        }else{
            startDate = new Date()
        }
        
        if(document.getElementById("Duration").checked && document.getElementById("EndDate").value){
            console.log("End date set");
            endDate = document.getElementById("EndDate").value;
        }

        if(document.getElementById("Inventory").checked && document.getElementById("Dispenser").checked && document.getElementById("DispenserSlot").value){
            console.log("Dispenser set");
            dispenserSlot = document.getElementById("DispenserSlot").value;
        }

        if(document.getElementById("Inventory").checked && document.getElementById("Restock").checked && document.getElementById("RestockDays").value){
            console.log("Restock set");
            restockDays = document.getElementById("RestockDays").value;
        }

        if(document.getElementById("Inventory").checked && document.getElementById("Prescription").checked && document.getElementById("PrescriptionDays").value){
            console.log("Prescription set");
            prescriptionDays = document.getElementById("PrescriptionDays").value;
        }

        const newTreatment = {
            "ID": userdata.IDindex,
            "Name":document.getElementById("Name").value,
            "Dose":document.getElementById("Dose").value,
            "Unit":document.getElementById("Unit").value,
            "Rate":document.getElementById("Rate").value,
            "RateType": document.getElementById("RateType").value,
            "Duration":{
                "StartDateTime":startDate,
                "EndDate":endDate,
            },
            "Inventory":{
                "Packages":document.getElementById("Packages").value,
                "QtyPerPackage":document.getElementById("QtyPerPackage").value,
                "TotalAvailable":Number(document.getElementById("Packages").value)*Number(document.getElementById("QtyPerPackage").value),
                "DispenserSlot":dispenserSlot,
                "RestockDays":restockDays,
                "PrescriptionDays":prescriptionDays,
                "DoctorName":document.getElementById("DoctorName").value,
                "DoctorNumber":document.getElementById("DoctorNumber").value,
                "DoctorEmail":document.getElementById("DoctorEmail").value
            }
        }
                
        await saveUserData(userdata, newTreatment)
     
        router.push("/main/prescriptions", "root")

    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot='start'>
                        <IonBackButton defaultHref='/main/prescriptions'></IonBackButton>
                    </IonButtons>
                    <IonTitle>Add New Treatment</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-no-padding">
                <IonCard>
                    <IonCardHeader><b>Fillout new Treatment info</b></IonCardHeader>
                    <IonCardContent>
                        <form onSubmit={addTreatmentFunc}>
                            <IonInput id='Name' label='Name' type='text' labelPlacement='floating' placeholder='e.g. Heart medicine' fill='outline' clearInput={true}></IonInput>
                            
                            <IonGrid className='ion-no-padding'><IonRow><IonCol>
                                    <IonInput  id='Dose' label='Dose' type='number' placeholder='e.g. 1, 20' labelPlacement='floating' className='ion-margin-top' fill='outline' clearInput={true}></IonInput>
                                </IonCol>
                                <IonCol size='6'>
                                    <IonSelect id='Unit' label="Unit" value={"Tablets"} placeholder="Select a Unit" interface='popover' labelPlacement="floating" className='ion-margin-top' fill="outline">
                                        <IonSelectOption value="Tablets">Tablets</IonSelectOption>
                                        <IonSelectOption value="ml">ml</IonSelectOption>
                                        <IonSelectOption value="Syringes">Syringes</IonSelectOption>
                                        <IonSelectOption value="Drops">Drops</IonSelectOption>
                                        <IonSelectOption value="mg">mg</IonSelectOption>
                                    </IonSelect>
                            </IonCol></IonRow></IonGrid>

                            <IonGrid className='ion-no-padding'><IonRow><IonCol>
                                <IonInput  id='Rate' label='Rate' type='number' placeholder='e.g. 1, 2, 3' labelPlacement='floating' className='ion-margin-top' fill='outline' clearInput={true}></IonInput>
                            </IonCol>
                            <IonCol size='6'>
                                <IonSelect id='RateType' label='Times' placeholder="Select a Unit" value={"Per Day"} interface='popover' labelPlacement="floating" className='ion-margin-top' fill="outline">
                                    <IonSelectOption value="Per Day">Per Day</IonSelectOption>
                                    <IonSelectOption value="After Meals">After Meals</IonSelectOption>
                                </IonSelect>
                            </IonCol></IonRow></IonGrid>

                            <IonModal keepContentsMounted={true}>
                                <IonDatetime id='StartDateTime' presentation="date-time" minuteValues="0,15,30,45"><span slot="title" >Select Start Date & Time</span></IonDatetime>
                            </IonModal>
                            <IonItem className='ion-no-padding'>
                                <IonLabel className='ion-no-padding'>Start Date & Time</IonLabel>
                                <IonDatetimeButton className='ion-no-padding' datetime="StartDateTime"></IonDatetimeButton>
                            </IonItem>
                            
                            <IonAccordionGroup multiple={true} className='ion-margine-top' expand='compact'>
                                <IonAccordion value="Duration" className='ion-no-padding'>
                                    <IonItem slot='header' className='ion-no-padding'>
                                        <IonToggle id='Duration' labelPlacement='start' className='ion-padding-horizontal' checked={false}>Limit Duration<IonText class='ion-accordion-toggle-icon'/></IonToggle>
                                    </IonItem>
                                    <IonModal keepContentsMounted={true}>
                                        <IonDatetime id='EndDate' presentation="date"><span slot="title" >Select End Date</span></IonDatetime>
                                    </IonModal>
                                    <IonItem slot='content'>
                                        <IonLabel>End Date</IonLabel>
                                        <IonDatetimeButton datetime="EndDate"></IonDatetimeButton>
                                    </IonItem>
                                </IonAccordion>

                                <IonAccordion value="Inventory" className='ion-no-padding'>
                                    <IonItem slot='header' className='ion-no-padding'>
                                        <IonToggle id='Inventory' labelPlacement='start' className='ion-padding-horizontal' checked={false}>Manage Inventory<IonText class='ion-accordion-toggle-icon'/></IonToggle>
                                    </IonItem>

                                    <div slot='content'>
                                        <IonInput  id='Packages' label='Number of Available Packages' type='number' placeholder='e.g. 1, 3, 12' labelPlacement='floating' className='ion-margin-top' fill='outline' clearInput={true}></IonInput>
                                        <IonInput  id='QtyPerPackage' label='Quantity Per Package' type='number' placeholder='e.g. 14, 20' labelPlacement='floating' className='ion-margin-top' fill='outline' clearInput={true}></IonInput>
                                        
                                        <IonAccordionGroup multiple={true} expand='inset'>
                                            <IonAccordion>
                                                <IonItem slot='header' className='ion-no-padding'>
                                                    <IonToggle id='Dispenser' labelPlacement='start' className='ion-padding-horizontal' checked={false}>Use Dispenser<IonText class='ion-accordion-toggle-icon'/></IonToggle>
                                                </IonItem>
                                                <div slot='content'>
                                                    <IonSelect id='DispenserSlot' label="Dispenser Slot" placeholder="Select a Slot" interface='popover' labelPlacement="floating" class='ion-margin-top' fill="outline">
                                                        <IonSelectOption value="1">Slot 1</IonSelectOption>
                                                        <IonSelectOption value="2">Slot 2</IonSelectOption>
                                                        <IonSelectOption value="3">Slot 3</IonSelectOption>
                                                        <IonSelectOption value="4">Slot 4</IonSelectOption>
                                                        <IonSelectOption value="5">Slot 5</IonSelectOption>
                                                        <IonSelectOption value="6">Slot 6</IonSelectOption>
                                                    </IonSelect>
                                                </div>
                                            </IonAccordion>

                                            <IonAccordion>
                                                <IonItem slot='header' className='ion-no-padding'>
                                                    <IonToggle id='Restock' labelPlacement='start' className='ion-padding-horizontal' checked={false}>Restock Reminder<IonText class='ion-accordion-toggle-icon'/></IonToggle>
                                                </IonItem>
                                                <div slot='content'>
                                                    <IonInput id='RestockDays' label='Days Before' type='number' placeholder='e.g. 1, 7' labelPlacement='floating' class='ion-margin-top' fill='outline' clearInput={true}></IonInput>
                                                </div>
                                            </IonAccordion>

                                            <IonAccordion>
                                                <IonItem slot='header' className='ion-no-padding'>
                                                    <IonToggle id='Prescription' labelPlacement='start' className='ion-padding-horizontal' checked={false}>Prescription Reminder<IonText class='ion-accordion-toggle-icon'/></IonToggle>
                                                </IonItem>
                                                <div slot='content'>
                                                    <IonInput  id='PrescriptionDays' label='Days Before' type='number' placeholder='e.g. 1, 7' labelPlacement='floating' class='ion-margin-top' fill='outline' clearInput={true}></IonInput>
                                                    <IonInput  id='DoctorName' label='Doctor Name' type='text' placeholder='e.g. Dr. Hinz' labelPlacement='floating' className='ion-margin-top' fill='outline' clearInput={true}></IonInput>
                                                    <IonInput  id='DoctorEmail' label='Doctor Email' type='email' placeholder='e.g. hinz@clinic.com' labelPlacement='floating' className='ion-margin-top' fill='outline' clearInput={true}></IonInput>
                                                    <IonInput  id='DoctorNumber' label='Doctor Number' type='tel' placeholder='e.g. 01511 111 1111' labelPlacement='floating' className='ion-margin-top' fill='outline' clearInput={true}></IonInput>
                                                </div>
                                            </IonAccordion>
                                        </IonAccordionGroup>
                                    </div>
                                </IonAccordion>

                            </IonAccordionGroup>
                            <IonButton type='submit' expand='block' color='success' className='ion-margin-top' >Add</IonButton>
                        </form>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default AddTreatment;