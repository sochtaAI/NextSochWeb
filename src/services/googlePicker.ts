/**
 * Google Picker Service for NEXT SOCH
 * Uses Google Drive & Google Picker API with OAuth token
 */

import { getAccessToken } from './firebase';

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export interface PickedGoogleDriveFile {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  iconUrl?: string;
  sizeBytes?: number;
  lastEditedUtc?: number;
  description?: string;
  pickedAt: string;
}

export interface PickerOptions {
  accessToken?: string;
  title?: string;
  onPicked: (files: PickedGoogleDriveFile[]) => void;
  onCancel?: () => void;
  onError?: (err: Error) => void;
}

let isPickerApiLoaded = false;
let pickerLoadPromise: Promise<void> | null = null;

/**
 * Ensures gapi script and the Google Picker API module are loaded
 */
export async function loadPickerApi(): Promise<void> {
  if (isPickerApiLoaded && window.google?.picker) {
    return Promise.resolve();
  }

  if (pickerLoadPromise) {
    return pickerLoadPromise;
  }

  pickerLoadPromise = new Promise<void>((resolve, reject) => {
    // If gapi is not yet on window, wait for it
    const checkGapi = () => {
      if (typeof window.gapi !== 'undefined') {
        window.gapi.load('picker', {
          callback: () => {
            isPickerApiLoaded = true;
            resolve();
          },
          onerror: () => {
            reject(new Error('Failed to load Google Picker client script'));
          }
        });
      } else {
        // Dynamically add script if not present
        const existingScript = document.querySelector('script[src="https://apis.google.com/js/api.js"]');
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = 'https://apis.google.com/js/api.js';
          script.async = true;
          script.defer = true;
          script.onload = () => checkGapi();
          script.onerror = () => reject(new Error('Could not load Google APIs script'));
          document.head.appendChild(script);
        } else {
          setTimeout(checkGapi, 100);
        }
      }
    };

    checkGapi();
  });

  return pickerLoadPromise;
}

/**
 * Launch the Google Picker dialog
 */
export async function openGooglePicker(options: PickerOptions): Promise<void> {
  try {
    await loadPickerApi();

    const token = options.accessToken || (await getAccessToken());
    if (!token) {
      throw new Error('Google OAuth token required. Please sign in with Google first.');
    }

    // Determine correct origin for iframe / sandbox environments
    const pickerOrigin =
      window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0
        ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
        : window.location.origin;

    const pickerCallback = (data: any) => {
      if (!data) return;

      if (data.action === window.google.picker.Action.PICKED) {
        const docs = data.docs || [];
        const pickedFiles: PickedGoogleDriveFile[] = docs.map((doc: any) => ({
          id: doc.id,
          name: doc.name || 'Untitled Document',
          url: doc.url || `https://drive.google.com/file/d/${doc.id}/view`,
          mimeType: doc.mimeType || 'application/octet-stream',
          iconUrl: doc.iconUrl,
          sizeBytes: doc.sizeBytes,
          lastEditedUtc: doc.lastEditedUtc,
          description: doc.description,
          pickedAt: new Date().toISOString()
        }));

        options.onPicked(pickedFiles);
      } else if (data.action === window.google.picker.Action.CANCEL) {
        if (options.onCancel) {
          options.onCancel();
        }
      }
    };

    // Construct view for Google Drive Documents (PDFs, Docs, Sheets, images, study files)
    const docsView = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
      .setIncludeFolders(true)
      .setSelectFolderEnabled(false);

    // Also support direct upload to Drive via DocsUploadView
    const uploadView = new window.google.picker.DocsUploadView();

    const builder = new window.google.picker.PickerBuilder()
      .addView(docsView)
      .addView(uploadView)
      .setOAuthToken(token)
      .setCallback(pickerCallback)
      .setOrigin(pickerOrigin);

    if (options.title) {
      builder.setTitle(options.title);
    } else {
      builder.setTitle('Select Study Material from Google Drive');
    }

    const picker = builder.build();
    picker.setVisible(true);
  } catch (error: any) {
    console.error('[Google Picker] Error launching picker:', error);
    if (options.onError) {
      options.onError(error instanceof Error ? error : new Error(String(error)));
    } else {
      throw error;
    }
  }
}
