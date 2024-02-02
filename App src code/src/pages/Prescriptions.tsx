import { IonAlert, IonButton, IonCard, IonCardContent, IonCheckbox, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow, IonText, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import { bandageOutline, beakerOutline, eyedropOutline, settingsOutline, trashBinOutline, waterOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import Treatments from './OngoingTreatments.json';
import Details from './Details';
import myFab from './myFab';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';


const iconList = {"Tablets":bandageOutline,"Syringes":eyedropOutline,"ml":beakerOutline, "Drops":waterOutline, "mg":bandageOutline}

 

const Prescriptions: React.FC = () => {
    //List States
    const [medicine, setMedicine] = useState<any[]>([]);
    //Modal States & Definitions
    const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
    const modal = useRef<HTMLIonModalElement>(null);

    const prescriptionFab = myFab("prescriptionFab");
    const prescriptionDetails = Details(selectedMedicine, modal);

    useIonViewWillEnter(async () => {
        const medicine = await getMedicine();
        console.log('getMedicin - Medicine: ', medicine)
        setMedicine(medicine);
    });

    const getMedicine = async () => {
        try{
            let contents = await Filesystem.readFile({
            path: '/OngoingTreatments.json',
            directory: Directory.Data,
            encoding: Encoding.UTF8,
            });
            console.log(contents);
            let data = JSON.parse(contents.data)
            return data.Treatments
        } catch{
            let contents = {"data":{
                "IDindex":0,
                "Treatments":[]
            }}
            return contents.data.Treatments
        }
    };


    const deleteUserData = async () => {
        try{
            await Filesystem.deleteFile({
                path: '/OngoingTreatments.json',
                directory: Directory.Data,
            });
            await Filesystem.deleteFile({
                path: '/Today.json',
                directory: Directory.Data,
            });
            console.log("file deleted");
        }catch{
            console.log("file doesn't exist");   
        }  
    };

    return (
        <IonPage>

            <IonHeader>
                <IonToolbar color={"primary"}>
                    <IonTitle>Prescriptions</IonTitle>
                    <IonButton slot='end' href="/settings"><IonIcon icon={settingsOutline}/></IonButton>
                    <IonButton id='delete'slot='start'><IonIcon icon={trashBinOutline}/>Clear data</IonButton>
                    <IonAlert
                        trigger="delete"
                        header="Delete ALL Onging Treatments!"
                        subHeader="This is NOT reversable!"
                        message="Please confirm or cancel"
                        buttons={[
                        {
                            text: 'Delete All',
                            role: 'confirm',
                            handler: deleteUserData,
                          },'Cancel']}
                    ></IonAlert>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-margine-top">
                <p></p>
                
                <IonTitle>Ongoing Medication</IonTitle>
                {medicine.map((medicine, index) => (
                    <IonCard key={medicine.ID} className='ion-no-padding'>
                        <IonCardContent className="ion-no-padding">
                            <IonItem lines="none" onClick={() => setSelectedMedicine(medicine)}>
                                <IonIcon icon={iconList[medicine.Unit]} slot='start' size='small' className="ion-no-padding"/>
                                <IonLabel className="ion-no-padding">
                                    {medicine.Name} 
                                    <p>{medicine.Dose*medicine.Rate} {medicine.Unit} Per Day</p>
                                </IonLabel>
                                <IonChip color={'primary'} slot='end'>
                                    {(medicine.Inventory.Packages==""||medicine.Inventory.QtyPerPackage=="") &&
                                    <small>No Inventory</small>}
                                    {(medicine.Inventory.Packages!=""||medicine.Inventory.QtyPerPackage!="") &&
                                    <small>{medicine.Inventory.TotalAvailable} {medicine.Unit} availabel</small>}
                                </IonChip>
                            </IonItem>
                        </IonCardContent>
                    </IonCard>
                ))}
                
                {prescriptionFab}

                <IonModal id='todayMod' breakpoints={[0, 0.5, 0.8]} initialBreakpoint={0.5} ref={modal} isOpen={selectedMedicine !== null} onIonModalDidDismiss={() => setSelectedMedicine(null)}>
                    {prescriptionDetails}
                </IonModal>

            </IonContent>
        </IonPage>
        
    );
};

export default Prescriptions;