import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export interface SiteInfoSlot {
  id: string;
  title: string;
  content: string;
  position: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteInfo {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  featuresTitle: string;
  featuresDescription: string;
  testimonialsTitle: string;
  testimonialsDescription: string;
  ctaTitle: string;
  ctaDescription: string;
  updatedAt: Date;
}

interface SiteInfoContextType {
  siteInfo: SiteInfo | null;
  siteInfoSlots: SiteInfoSlot[];
  updateSiteInfo: (updates: Partial<Omit<SiteInfo, 'id' | 'updatedAt'>>) => Promise<void>;
  addSiteInfoSlot: (slot: Omit<SiteInfoSlot, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSiteInfoSlot: (id: string, updates: Partial<SiteInfoSlot>) => Promise<void>;
  deleteSiteInfoSlot: (id: string) => Promise<void>;
  toggleSlotActive: (id: string) => Promise<void>;
  refreshSiteInfo: () => Promise<void>;
}

const SiteInfoContext = createContext<SiteInfoContextType | undefined>(undefined);

export function SiteInfoProvider({ children }: { children: ReactNode }) {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const [siteInfoSlots, setSiteInfoSlots] = useState<SiteInfoSlot[]>([]);

  // Load site info from database
  const refreshSiteInfo = useCallback(async () => {
    try {
      // Load main site info
      const { data: siteData, error: siteError } = await (supabase as any)
        .from('site_info')
        .select('*')
        .single();

      if (siteError && siteError.code !== 'PGRST116') {
        logger.error('Error loading site info:', siteError);
      } else if (siteData) {
        setSiteInfo({
          id: siteData.id,
          heroTitle: siteData.hero_title,
          heroSubtitle: siteData.hero_subtitle,
          heroDescription: siteData.hero_description,
          aboutTitle: siteData.about_title,
          aboutDescription: siteData.about_description,
          featuresTitle: siteData.features_title,
          featuresDescription: siteData.features_description,
          testimonialsTitle: siteData.testimonials_title,
          testimonialsDescription: siteData.testimonials_description,
          ctaTitle: siteData.cta_title,
          ctaDescription: siteData.cta_description,
          updatedAt: new Date(siteData.updated_at),
        });
      }

      // Load site info slots
      const { data: slotsData, error: slotsError } = await (supabase as any)
        .from('site_info_slots')
        .select('*')
        .order('position', { ascending: true });

      if (slotsError) {
        logger.error('Error loading site info slots:', slotsError);
      } else if (slotsData) {
        const mappedSlots: SiteInfoSlot[] = slotsData.map((slot: any) => ({
          id: slot.id,
          title: slot.title,
          content: slot.content,
          position: slot.position,
          active: slot.active,
          createdAt: new Date(slot.created_at),
          updatedAt: new Date(slot.updated_at),
        }));
        setSiteInfoSlots(mappedSlots);
        logger.log(`Loaded ${mappedSlots.length} site info slots`);
      }
    } catch (error) {
      logger.error('Error loading site info:', error);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    refreshSiteInfo();
  }, [refreshSiteInfo]);

  // Site info operations
  const updateSiteInfo = useCallback(async (updates: Partial<Omit<SiteInfo, 'id' | 'updatedAt'>>) => {
    const updateData: any = {};
    if (updates.heroTitle !== undefined) updateData.hero_title = updates.heroTitle;
    if (updates.heroSubtitle !== undefined) updateData.hero_subtitle = updates.heroSubtitle;
    if (updates.heroDescription !== undefined) updateData.hero_description = updates.heroDescription;
    if (updates.aboutTitle !== undefined) updateData.about_title = updates.aboutTitle;
    if (updates.aboutDescription !== undefined) updateData.about_description = updates.aboutDescription;
    if (updates.featuresTitle !== undefined) updateData.features_title = updates.featuresTitle;
    if (updates.featuresDescription !== undefined) updateData.features_description = updates.featuresDescription;
    if (updates.testimonialsTitle !== undefined) updateData.testimonials_title = updates.testimonialsTitle;
    if (updates.testimonialsDescription !== undefined) updateData.testimonials_description = updates.testimonialsDescription;
    if (updates.ctaTitle !== undefined) updateData.cta_title = updates.ctaTitle;
    if (updates.ctaDescription !== undefined) updateData.cta_description = updates.ctaDescription;

    updateData.updated_at = new Date().toISOString();

    if (siteInfo) {
      // Update existing
      const { error } = await (supabase as any)
        .from('site_info')
        .update(updateData)
        .eq('id', siteInfo.id);

      if (error) throw error;
    } else {
      // Create new
      const id = 'site-info-main';
      const { error } = await (supabase as any)
        .from('site_info')
        .insert({ id, ...updateData });

      if (error) throw error;
    }

    await refreshSiteInfo();
  }, [siteInfo, refreshSiteInfo]);

  // Site info slot operations
  const addSiteInfoSlot = useCallback(async (slot: Omit<SiteInfoSlot, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `slot-${Date.now()}`;
    
    const { error } = await (supabase as any).from('site_info_slots').insert({
      id,
      title: slot.title,
      content: slot.content,
      position: slot.position,
      active: slot.active,
    });

    if (error) throw error;
    await refreshSiteInfo();
  }, [refreshSiteInfo]);

  const updateSiteInfoSlot = useCallback(async (id: string, updates: Partial<SiteInfoSlot>) => {
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.content !== undefined) updateData.content = updates.content;
    if (updates.position !== undefined) updateData.position = updates.position;
    if (updates.active !== undefined) updateData.active = updates.active;
    updateData.updated_at = new Date().toISOString();

    const { error } = await (supabase as any)
      .from('site_info_slots')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    await refreshSiteInfo();
  }, [refreshSiteInfo]);

  const deleteSiteInfoSlot = useCallback(async (id: string) => {
    const { error } = await (supabase as any)
      .from('site_info_slots')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await refreshSiteInfo();
  }, [refreshSiteInfo]);

  const toggleSlotActive = useCallback(async (id: string) => {
    const slot = siteInfoSlots.find(s => s.id === id);
    if (!slot) return;

    const { error } = await (supabase as any)
      .from('site_info_slots')
      .update({ active: !slot.active })
      .eq('id', id);

    if (error) throw error;
    await refreshSiteInfo();
  }, [siteInfoSlots, refreshSiteInfo]);

  return (
    <SiteInfoContext.Provider
      value={{
        siteInfo,
        siteInfoSlots,
        updateSiteInfo,
        addSiteInfoSlot,
        updateSiteInfoSlot,
        deleteSiteInfoSlot,
        toggleSlotActive,
        refreshSiteInfo,
      }}
    >
      {children}
    </SiteInfoContext.Provider>
  );
}

export function useSiteInfo() {
  const context = useContext(SiteInfoContext);
  if (context === undefined) {
    throw new Error('useSiteInfo must be used within a SiteInfoProvider');
  }
  return context;
}