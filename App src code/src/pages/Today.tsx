import { IonButton, IonCard, IonCardContent, IonChip, IonContent, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonModal, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { arrowRedoCircleOutline, bandageOutline, beakerOutline, checkmarkCircle, eyedropOutline, waterOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import Details from './Details';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { CapacitorHttp } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const iconList = {"Tablets":bandageOutline,"Syringes":eyedropOutline,"ml":beakerOutline, "Drops":waterOutline, "mg":bandageOutline}
const statusColors = {"Taken":"success","Missed":"danger","Skipped":"warning"}
let todayforHistory={}
const Today: React.FC = () => {
    //List States
    const [todayTreatments, setTodayTreatments] = useState<any[]>([]);
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    //Modal States & Definitions
    const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
    const modal = useRef<HTMLIonModalElement>(null);
    const router = useIonRouter();

    const todayDetails = Details(selectedMedicine, modal);

    useIonViewWillEnter(async () => {
        await LocalNotifications.requestPermissions();
        contentGeneration();
/*        
        let time = new Date(Date.now()+10*1000)

        LocalNotifications.schedule({
            notifications: [
                {
                    id: 1,
                    title: "Time for Your Medicine",
                    body: "Demo Notification",
                    iconColor: '#FF0000',
                    schedule:{at: time}
                }
            ]
        })*/
    });

    //Data Handlers 
    //Data Readers
    const contentGeneration = async () => {
        let lodadedmedicine = await getMedicine();        
        let todayMedicine = await getTodayMedicine(lodadedmedicine.Treatments);
        todayMedicine = await getTimes(lodadedmedicine.Treatments, todayMedicine);        
        todayforHistory = todayMedicine
        setTodayTreatments(todayMedicine.Treatments)
        setPrescriptions(lodadedmedicine)
        saveUserData(todayMedicine.Treatments)
    }

    const getMedicine = async () => {
        try{
            let contents = await Filesystem.readFile({
            path: '/OngoingTreatments.json',
            directory: Directory.Data,
            encoding: Encoding.UTF8,
            });
            let data = JSON.parse(contents.data)
            return data
        } catch{
            let contents = {"data":{
                "IDindex":0,
                "Treatments":[]
            }}
            return contents.data
        }
    };

    const getTodayMedicine =async (medicine) => {
        try{
            let contents = await Filesystem.readFile({
            path: '/Today.json',
            directory: Directory.Data,
            encoding: Encoding.UTF8,
            });
            let data = JSON.parse(contents.data)
            console.log(data);
            
            if(data.Date==(new Date().toDateString())){
                return data
            }else{
                saveHistory(data)
                let contents = {"data":{
                    "Date":(new Date()).toDateString(),
                    "Treatments":[]
                }}
                return contents.data
            }
        } catch{
            let contents = {"data":{
                "Date":(new Date()).toDateString(),
                "Treatments":[]
            }}
            return contents.data
        }
    }

    const readHistory =async () => {
        try{
            let contents = await Filesystem.readFile({
            path: '/History.json',
            directory: Directory.Data,
            encoding: Encoding.UTF8,
            });
            let history = JSON.parse(contents.data)
            console.log(history);
            return history
        }catch{
            let history = {History:[]}
            return history
        } 
    }

    //Data Savers
    const saveUserData = async (userdata) => {
        console.log("starting to write file");
        try{
            await Filesystem.writeFile({
                path: '/Today.json',
                data: JSON.stringify({
                    "Date":(new Date()).toDateString(),
                    "Treatments":userdata
                }),
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            console.log("done"); 
        }catch{
            console.log("failed");
        }
    };

    const saveHistory = async (userdata) => {
        let history = await readHistory(); 
        history.History.push(userdata)
        console.log("starting to write file");
        try{
            await Filesystem.writeFile({
                path: '/History.json',
                data: JSON.stringify(history),
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            console.log("done"); 
        }catch{
            console.log("failed");
        }
    };

    const savePrescriptions = async () => {
        console.log("starting to write file");
        try{
            await Filesystem.writeFile({
                path: '/OngoingTreatments.json',
                data: JSON.stringify(prescriptions),
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            console.log("done"); 
        }catch{
            console.log("failed");
        }
    };
    
    const saveHistory2 = async (index) => {
        let todayMedicine = await getTodayMedicine(prescriptions.Treatments);
        let histdate = new Date(todayMedicine.Date)
        histdate.setDate(histdate.getDate()-index)
        todayMedicine.Date = histdate.toDateString()
        let history = await readHistory();
        console.log(history.History);
        
        history.History.push(todayMedicine)
        console.log("starting to write file");
        try{
            await Filesystem.writeFile({
                path: '/History.json',
                data: JSON.stringify(history),
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            console.log("done"); 
        }catch{
            console.log("failed");
        }
    };

    // Page Content Generator
    const getTimes = (medicine, todayMedicine) => {
        let newTimes = [];
        console.log(medicine);
        
        medicine.forEach(med => {            
            if(med.RateType=="After Meals"){
                let hours = [9,14,20]
                for (var i = 0; i < med.Rate; i++) {
                    let time = new Date()
                    time.setHours(hours[i],0,0,0)
                    newTimes.push({"Med":med, "ID":med.ID, "Name":med.Name, "Time":time, "Status":"", "Dose":med.Dose, "Unit":med.Unit, "RateType":med.RateType, "DispenserSlot":med.Inventory.DispenserSlot})
                }   
            }else{                        
                for (var i = 0; i < med.Rate; i++) {
                    let reftime = new Date(med.Duration.StartDateTime)
                    let time = new Date()
                    time.setHours(reftime.getHours(),reftime.getMinutes(),0,0)
                    time.setHours((time.getHours()+Number(((24/med.Rate)*i))%24).toFixed(0))
                    newTimes.push({"Med":med, "ID":med.ID, "Name":med.Name, "Time":time, "Status":"", "Dose":med.Dose, "Unit":med.Unit, "RateType":med.RateType, "DispenserSlot":med.Inventory.DispenserSlot})
                }   
            } 
        });
        
        if(todayMedicine.Treatments.length!=0){
            todayMedicine.Treatments.forEach(time => {
                var index = newTimes.findIndex((t)=>{
                    var timeOld = new Date(time.Time)
                    return (t.ID==time.ID && t.Time==timeOld.toString())
                })                
                newTimes.splice(index,1)           
            })
            newTimes.forEach(time => {
                todayMedicine.Treatments.push(time);

                const notID = time.ID+Number(time.Time.getHours())+Number(time.Time.getMinutes())
               
                LocalNotifications.schedule({
                    notifications: [
                        {
                            id: notID,
                            title: "Time for Your Medicine",
                            body: time.Name,
                            iconColor: '#00FF00',
                            schedule: {at: time.Time},
                        }
                    ]
                })
            })
            console.log(todayMedicine.Treatments);
            
        }else{
            console.log("oh no!");
            todayMedicine.Treatments = newTimes
        }
        
        todayMedicine.Treatments.sort((a,b)=>{
            const timeA=new Date(a.Time)
            const timeB=new Date(b.Time)
            return timeA - timeB;
        })

        const treatmentsSet = new Set(todayMedicine.Treatments)
        todayMedicine.Treatments = [];
        treatmentsSet.forEach(treatment => {
            todayMedicine.Treatments.push(treatment) 
        })

        todayMedicine.Treatments.forEach(treatmet => {
            treatmet.Time = new Date(treatmet.Time)
        })

        return todayMedicine
    }

    // Action handlers
    const skipMedicine = (medicine) => {
        if(medicine.Status=="Taken"){
            prescriptions.Treatments.forEach(med => {
                if(med.ID==medicine.ID){
                    med.Inventory.TotalAvailable=Number(med.Inventory.TotalAvailable)+Number(med.Dose)
                }
            })
        }
        console.log(prescriptions);
        savePrescriptions()

        medicine.Status = "Skipped"
        saveUserData(todayTreatments)
        document.getElementById('sliding-'+medicine.ID+medicine.Time.toString())?.close()
        router.push()
    }

    const confirmMedicine = (medicine) => {
        const options = {
            url: ("http://192.168.39.12/?type=0$name="+medicine.Name+"&slot="+medicine.DispenserSlot+"%20").replace(" ","-"),
            headers: { 'X-Fake-Header': 'Fake-Value' },
            params: { size: 'XL' },
        };
        if(medicine.DispenserSlot!=null){
            CapacitorHttp.get(options);
        }

        if(medicine.Status=="" || medicine.Status=="Skipped"){
            prescriptions.Treatments.forEach(med => {
                if(med.ID==medicine.ID){
                    med.Inventory.TotalAvailable=Number(med.Inventory.TotalAvailable)-Number(med.Dose)
                }
            })
        }

        console.log(prescriptions);
        savePrescriptions()

        medicine.Status = "Taken"
        saveUserData(todayTreatments)
        document.getElementById('sliding-'+medicine.ID+medicine.Time.toString())?.close()
        router.push()
        }


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={"primary"}>
                    <IonTitle>Today Planer</IonTitle>
                    {/*<IonButton slot='end' onClick={(ev) => saveHistory2(6)}>histoy now</IonButton>
                    <IonButton slot='end' onClick={(ev) => saveHistory2(7)}>histoy now2</IonButton>
                    <IonButton slot='end' onClick={(ev) => saveHistory2(8)}>histoy now3</IonButton>*/}
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <p></p>

                {todayTreatments.map((medicine, index) => (
                    <IonCard key={medicine.ID+medicine.Time.toString()}>
                        <IonCardContent className="ion-no-padding">
                            <IonItemSliding id={'sliding-'+medicine.ID+medicine.Time.toString()}>
                                <IonItem lines="none" onClick={() => setSelectedMedicine(medicine.Med)}>
                                    <IonIcon icon={iconList[medicine.Unit]} slot='start' size='small'/>
                                    <IonLabel className='ion-no-padding'>
                                        {medicine.Name} 
                                        <p>{medicine.Dose} {medicine.Unit}</p>
                                    </IonLabel>
                                    <IonChip color={(medicine.Status!="" && statusColors[medicine.Status])||'primary'} slot='end'>
                                        {medicine.Status!="" && 
                                        <small>{medicine.Time.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})} {medicine.Status}</small>}
                                        {medicine.Status=="" && medicine.DispenserSlot!=null &&
                                        <small>{medicine.Time.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})} at slot {medicine.DispenserSlot}</small>
                                        }{medicine.Status=="" && medicine.DispenserSlot==null &&
                                        <small>{medicine.Time.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}</small>
                                        }
                                    </IonChip>
                                </IonItem>
                                <IonItemOptions slot="end">
                                    <IonItemOption color="warning" onClick={(ev)=>skipMedicine(medicine)}>
                                        <IonIcon slot="icon-only" icon={arrowRedoCircleOutline}/>
                                    </IonItemOption>
                                    <IonItemOption color="success" onClick={(ev)=>confirmMedicine(medicine)}>
                                        <IonIcon slot="icon-only" icon={checkmarkCircle}/>
                                    </IonItemOption>
                                </IonItemOptions>
                            </IonItemSliding>
                        </IonCardContent>
                    </IonCard>
                ))}
                

                <IonModal id='todayMod' breakpoints={[0, 0.5, 0.8]} initialBreakpoint={0.5} ref={modal} isOpen={selectedMedicine !== null} onIonModalDidDismiss={() => setSelectedMedicine(null)}>
                    {todayDetails}
                </IonModal>

            </IonContent>
        </IonPage>
        
    );
};

export default Today;