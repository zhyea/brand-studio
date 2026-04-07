import { inject } from 'vue';
import { STUDIO_INJECT_KEY, type StudioEditorApi } from './useStudioEditor';

export function useStudio(): StudioEditorApi {
  return inject(STUDIO_INJECT_KEY)!;
}
