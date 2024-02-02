import { IonFab, IonFabButton, IonIcon, useIonRouter } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import React from 'react';

const myFab: React.FC = (idname) => {

    const router = useIonRouter();
    
    const addNew = (event: any) => {
        event.preventDefault();
        console.log(router.routeInfo.pathname);
        router.push("/addtreatment", "root")
    };
    
    return (
        <IonFab slot="fixed" horizontal="end" vertical="bottom" className='ion-padding'>
            <IonFabButton id={idname} onClick={addNew}>
                <IonIcon icon={addOutline}></IonIcon>
            </IonFabButton>                   
        </IonFab>
    );
};

export default myFab;