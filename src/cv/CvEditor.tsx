// cv editor: profile + skill groups + sidebar sections + entry sections
// no photo, no name/title/contact, no theme/mode — those all live in stammdaten

import { useApp, useAppDispatch } from "../state/AppContext";
import { useT } from "../i18n/LocaleContext";
import { TextAreaField } from "../editor/TextAreaField";
import { EditorSection } from "../editor/EditorSection";
import { SkillGroups } from "./SkillGroups";
import { SidebarSections } from "./SidebarSections";
import { EntrySections } from "./EntrySections";

export function CvEditor() {
  const { cv } = useApp();
  const dispatch = useAppDispatch();
  const t = useT();

  return (
    <div className="editor">
      <EditorSection title={t("cv.section.profile")}>
        <TextAreaField
          label={t("cv.field.profile")}
          value={cv.profile}
          placeholder={t("cv.field.profile.placeholder")}
          onChange={(value) => dispatch({ type: "CV_SET_PROFILE", value })}
          rows={5}
        />
      </EditorSection>

      <SkillGroups />
      <SidebarSections />
      <EntrySections />
    </div>
  );
}
