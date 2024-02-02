import { IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/react';
import { listOutline, calendarOutline, medkitOutline } from 'ionicons/icons';
import React from 'react';
import { Redirect, Route } from 'react-router';
import Today from './Today';
import MedHistory from './MedHistory';
import Prescriptions from './Prescriptions';
import AddTreatment from './AddTreatment';

const MainUI: React.FC = () => {

    return (
        <IonTabs>
            <IonTabBar slot="bottom">
                <IonTabButton tab="Today" href="/main/today">
                    <IonIcon icon={listOutline} />
                    <IonLabel>Today</IonLabel>
                </IonTabButton>

                <IonTabButton tab="History" href="/main/medhistory">
                    <IonIcon icon={calendarOutline} />
                    <IonLabel>History</IonLabel>
                </IonTabButton>

                <IonTabButton tab="Prescriptions" href="/main/prescriptions">
                    <IonIcon icon={medkitOutline} />
                    <IonLabel>Prescriptions</IonLabel>
                </IonTabButton>
            </IonTabBar>

            <IonRouterOutlet id="tab">
                <Route path="/main" exact><Redirect to="/main/today"/></Route>
                <Route path="/main/today" component={Today}/>
                <Route path="/main/medhistory" component={MedHistory}/>
                <Route path="/main/prescriptions" component={Prescriptions}/>
            </IonRouterOutlet>
        </IonTabs>
    );
};

export default MainUI;