import { IonButton, IonButtons, IonCard, IonCardContent, IonChip, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonTitle, IonToolbar } from '@ionic/react';
import { bandageOutline, eyedropOutline, beakerOutline, waterOutline } from 'ionicons/icons';
import React from 'react';
const iconList = {"Tablets":bandageOutline,"Syringes":eyedropOutline,"ml":beakerOutline, "Drops":waterOutline, "mg":bandageOutline}


const Details: React.FC = (selectedMedicine, modal) => {

    const dateLabel = (date) => {
        const dateLabel = new Date(date)
        console.log(dateLabel.toDateString())
        return dateLabel.toDateString()
    }

    const getTimes = (medicine) => {        
        let times = []
        if(medicine?.RateType=="After Meals"){
            times = ["9:00am","14:00pm", "20:00pm"]
            times.slice(3-medicine?.Rate)
        }else{            
            for (var i = 0; i < medicine?.Rate; i++) {
                let time = new Date(medicine?.Duration.StartDateTime)
                time.setHours((time.getHours()+Number(((24/medicine?.Rate)*i))%24).toFixed(0))
                times.push(time.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'}))
            }   
        }
        return times
    }

    return (
        <>
            <IonHeader>
                <IonToolbar color={'light'}>
                    <IonButtons slot="start">
                        <IonButton onClick={() => modal.current?.dismiss()}>Close</IonButton>
                    </IonButtons>
                    <IonTitle>
                        {selectedMedicine?.Name}
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <p></p>
                <IonLabel className='ion-padding'>Description</IonLabel>
                <IonCard className="ion-no-padding">
                    <IonCardContent className="ion-no-padding">
                        <IonItem lines="none">
                            <IonIcon icon={iconList[selectedMedicine?.Unit]} slot='start' />
                            <IonLabel class="ion-text-wrap">
                            {selectedMedicine?.Dose*selectedMedicine?.Rate} {selectedMedicine?.Unit} {selectedMedicine?.RateType}
                            </IonLabel>
                        </IonItem>
                    </IonCardContent>
                </IonCard>

                <IonLabel className='ion-padding'>Time & Duration</IonLabel>
                <IonCard className="ion-no-padding">
                    <IonCardContent className="ion-no-padding">
                        <IonItem lines="none">
                            <IonLabel class="ion-text-wrap">
                                <b>Started on:</b> {dateLabel(selectedMedicine?.Duration.StartDateTime)}
                                {selectedMedicine?.Duration.EndDate!=null && <><br/><b>Ends on:</b> {dateLabel(selectedMedicine?.Duration.EndDate)}</>}
                                <br/>
                                <b>Taken at:</b> {getTimes(selectedMedicine).map((time, inddex) => (
                                    <IonChip key={time} color='secondary'>{time}</IonChip>
                                ))}
                            </IonLabel>
                        </IonItem>
                    </IonCardContent>
                </IonCard>

                {((selectedMedicine?.Inventory.Packages!="" && selectedMedicine?.Inventory.Packages!=null)||
                (selectedMedicine?.Inventory.QtyPerPackage!="" && selectedMedicine?.Inventory.QtyPerPackage!=null)||
                (selectedMedicine?.Inventory.RestockDays!="" && selectedMedicine?.Inventory.RestockDays!=null)||
                (selectedMedicine?.Inventory.DispenserSlot!="" && selectedMedicine?.Inventory.DispenserSlot!=null))&&
                <>
                    <IonLabel className='ion-padding'>Inventory</IonLabel>
                    <IonCard className="ion-no-padding">
                        <IonCardContent className="ion-no-padding">
                            <IonItem lines="none">
                                <IonLabel class="ion-text-wrap">
                                {selectedMedicine?.Inventory.Packages!="" && selectedMedicine?.Inventory.Packages!=null && <><b>Packages in Stock:</b> {selectedMedicine?.Inventory.Packages}</>}
                                {selectedMedicine?.Inventory.QtyPerPackage!="" && selectedMedicine?.Inventory.QtyPerPackage!=null && <><br/><b>Total in Stock:</b> {selectedMedicine?.Inventory.TotalAvailable}</>}
                                {/*Bug days are rounded up, reminder might be a day late?*/}
                                {selectedMedicine?.Inventory.RestockDays!="" && selectedMedicine?.Inventory.RestockDays!=null && <><br/><b>Restock needed in:</b> {Number((selectedMedicine?.Inventory.TotalAvailable)/(selectedMedicine?.Rate*selectedMedicine?.Dose)-selectedMedicine?.Inventory.RestockDays).toFixed(0)} Days</>}
                                {selectedMedicine?.Inventory.DispenserSlot!="" && selectedMedicine?.Inventory.DispenserSlot!=null && <><br/><b>Dispenser slot:</b> {selectedMedicine?.Inventory.DispenserSlot}</>}
                                </IonLabel>
                            </IonItem>
                        </IonCardContent>
                    </IonCard>
                </>}

                {((selectedMedicine?.Inventory.DoctorName!="" && selectedMedicine?.Inventory.DoctorName!=null)||
                (selectedMedicine?.Inventory.DoctorNumber!="" && selectedMedicine?.Inventory.DoctorNumber!=null)||
                (selectedMedicine?.Inventory.DoctorEmail!="" && selectedMedicine?.Inventory.DoctorEmail!=null)||
                (selectedMedicine?.Inventory.PrescriptionDays!="" && selectedMedicine?.Inventory.PrescriptionDays!=null))&&
                <>
                    <IonLabel className='ion-padding'>Prescription</IonLabel>
                    <IonCard className="ion-no-padding">
                        <IonCardContent className="ion-no-padding">
                            <IonItem lines="none">
                                <IonLabel class="ion-text-wrap">
                                {selectedMedicine?.Inventory.DoctorName!="" && selectedMedicine?.Inventory.DoctorName!=null && <><b>Doctor:</b> {selectedMedicine?.Inventory.DoctorName}</>}
                                {selectedMedicine?.Inventory.DoctorNumber!="" && selectedMedicine?.Inventory.DoctorNumber!=null && <><br/><b>Number:</b> {selectedMedicine?.Inventory.DoctorNumber}</>}
                                {selectedMedicine?.Inventory.DoctorEmail!="" && selectedMedicine?.Inventory.DoctorEmail!=null && <><br/><b>Email:</b> {selectedMedicine?.Inventory.DoctorEmail}</>}
                                {/*Bug days are rounded up, reminder might be a day late?*/}
                                {selectedMedicine?.Inventory.PrescriptionDays!="" && selectedMedicine?.Inventory.PrescriptionDays!=null && <><br/><b>New prescription needed in:</b> {Number((selectedMedicine?.Inventory.TotalAvailable)/(selectedMedicine?.Rate*selectedMedicine?.Dose)-selectedMedicine?.Inventory.PrescriptionDays).toFixed(0)} Days</>}
                                </IonLabel>
                            </IonItem>
                        </IonCardContent>
                    </IonCard>
                </>}
            </IonContent>
        </>
    );
};

export default Details;