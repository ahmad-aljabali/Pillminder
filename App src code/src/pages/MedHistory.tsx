import { IonCard, IonCardContent, IonChip, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonModal, IonPage, IonText, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import { bandageOutline, beakerOutline, eyedropOutline, waterOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import History from './dummyData/History.json';
import Details from './Details';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const iconList = {"Tablets":bandageOutline,"Syringes":eyedropOutline,"ml":beakerOutline, "Drops":waterOutline, "mg":bandageOutline}
const statusColors = {"Taken":"success","Missed":"danger","Skipped":"warning"}
 

const MedHistory: React.FC = () => {
    //List States
    const [history, setHistory] = useState<any[]>([]);
    //Modal States & Definitions
    const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
    const modal = useRef<HTMLIonModalElement>(null);

    const historyDetails = Details(selectedMedicine, modal);

    useIonViewWillEnter(async () => {
        const history = await readHistory();
        console.log('getHistory - History: ', history)
        setHistory(history);
    });

    const readHistory =async () => {
        try{
            let contents = await Filesystem.readFile({
            path: '/History.json',
            directory: Directory.Data,
            encoding: Encoding.UTF8,
            });
            let history = JSON.parse(contents.data)
            console.log(history);
            
            return history.History
        }catch{
            let history = {History:[]}
            return history.History
        } 
    }

    const dateLabel = (day) => {
        const dateLabel = new Date(day.Date)
        console.log(dateLabel.toDateString())
        return dateLabel.toDateString()
    }

    return (
        <IonPage>

            <IonHeader>
                <IonToolbar color={"primary"}>
                    <IonTitle>History</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <p></p>
                {history.toReversed().map((day, index) => (
                    <div key={index}>
                        <IonTitle>{dateLabel(day)}</IonTitle>
                        <IonCard>
                            <IonCardContent className="ion-no-padding">
                                {day.Treatments.map((medicine, index) => (
                                    <IonItem key={index} lines="none" onClick={() => setSelectedMedicine(medicine.Med)}>
                                        <IonIcon icon={iconList[medicine.Unit]} slot='start' size='small'/>
                                        <IonLabel>
                                            {medicine.Name} 
                                            <p>{medicine.Dose} {medicine.Unit}</p>
                                        </IonLabel>
                                        <IonChip color={(medicine.Status!="" && statusColors[medicine.Status])||'danger'} slot='end'>
                                            {medicine.Status!="" && 
                                            <small>{(new Date(medicine.Time)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})} {medicine.Status}</small>}
                                            {medicine.Status=="" && medicine.DispenserSlot!=null &&
                                            <small>{(new Date(medicine.Time)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})} Missed</small>
                                            }{medicine.Status=="" && medicine.DispenserSlot==null &&
                                            <small>{(new Date(medicine.Time)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}</small>
                                            }
                                        </IonChip>
                                    </IonItem>                    
                                ))}
                            </IonCardContent>
                        </IonCard>
                    </div>
                ))}

                <IonModal id='historyMod' breakpoints={[0, 0.5, 0.8]} initialBreakpoint={0.5} ref={modal} isOpen={selectedMedicine !== null} onIonModalDidDismiss={() => setSelectedMedicine(null)}>
                    {historyDetails}
                </IonModal>

            </IonContent>
        </IonPage>
        
    );
};

export default MedHistory;