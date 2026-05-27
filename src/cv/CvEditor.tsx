// cv editor: profile + skill groups + sidebar sections + entry sections
// no photo, no name/title/contact, no theme/mode — those all live in stammdaten

import { useApp, useAppDispatch } from "../state/AppContext";
import { TextAreaField } from "../editor/TextAreaField";
import { SkillGroups } from "./SkillGroups";
import { SidebarSections } from "./SidebarSections";
import { EntrySections } from "./EntrySections";

export function CvEditor() {
  const { cv } = useApp();
  const dispatch = useAppDispatch();

  return (
    <div className="editor">
      <section className="editor-section">
        <h2>Profile</h2>
        <TextAreaField
          label="About me (CV-specific, separate from stammdaten kurz)"
          value={cv.profile}
          placeholder="Short profile text..."
          onChange={(value) => dispatch({ type: "CV_SET_PROFILE", value })}
          rows={5}
        />
      </section>

      <SkillGroups />
      <SidebarSections />
      <EntrySections />
    </div>
  );
}
