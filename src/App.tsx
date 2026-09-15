/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { ToastContainer } from './components/layout/ToastContainer';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { LandingPage } from './components/landing/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { SmartStudyScreen } from './components/smart-study/SmartStudyScreen';
import { CollectionsView } from './components/collections/CollectionsView';
import { PYQExplorer } from './components/pyqs/PYQExplorer';
import { MistakeNotebook } from './components/mistakes/MistakeNotebook';
import { SmartRevision } from './components/revision/SmartRevision';
import { TestInterface } from './components/tests/TestInterface';
import { SochBattle } from './components/battle/SochBattle';
import { AiTutorModal } from './components/ai/AiTutorModal';
import { ShareCardModal } from './components/share/ShareCardModal';
import { StudentAnalyticsView } from './components/dashboard/StudentAnalyticsView';
import { PricingView } from './components/monetization/PricingView';
import { AdminView } from './components/admin/AdminView';
import { ExpiredPassBanner } from './components/monetization/ExpiredPassBanner';
import { PricingModal } from './components/monetization/PricingModal';
import { CheckoutModal } from './components/monetization/CheckoutModal';
import { UpgradeTriggerModal } from './components/monetization/UpgradeTriggerModal';
import { SubscriptionDashboardModal } from './components/monetization/SubscriptionDashboardModal';
import { ReferralModal } from './components/monetization/ReferralModal';
import { FirebaseAccountModal } from './components/layout/FirebaseAccountModal';

const AppContent: React.FC = () => {
  const {
    activeTab,
    isPricingModalOpen,
    setIsPricingModalOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    selectedPlanForCheckout,
  } = useApp();

  const isSmartStudyActive = activeTab === 'smart-study';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />
      <ExpiredPassBanner />

      <main className={`flex-1 ${isSmartStudyActive ? 'pb-0' : 'pb-16 md:pb-0'}`}>
        {activeTab === 'landing' && <LandingPage />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'smart-study' && <SmartStudyScreen />}
        {activeTab === 'collections' && <CollectionsView />}
        {activeTab === 'pyqs' && <PYQExplorer />}
        {activeTab === 'mistakes' && <MistakeNotebook />}
        {activeTab === 'revision' && <SmartRevision />}
        {activeTab === 'tests' && <TestInterface />}
        {activeTab === 'battle' && <SochBattle />}
        {activeTab === 'analytics' && <StudentAnalyticsView />}
        {activeTab === 'pricing' && <PricingView />}
        {activeTab === 'admin' && <AdminView />}
      </main>

      {/* Hide bottom navigation in smart study to give student maximum reading & practice height */}
      {!isSmartStudyActive && <MobileBottomNav />}

      <ToastContainer />
      <GlobalSearchModal />
      <AiTutorModal />
      <ShareCardModal />

      {/* Monetization & Subscription modals */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        plan={selectedPlanForCheckout}
      />
      <UpgradeTriggerModal />
      <SubscriptionDashboardModal />
      <ReferralModal />
      <FirebaseAccountModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
