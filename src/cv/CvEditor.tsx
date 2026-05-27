// cv editor: profile + skill groups + sidebar sections + entry sections
// no photo, no name/title/contact, no theme/mode — those all live in stammdaten

import { useApp, useAppDispatch } from "../state/AppContext";
import { useT } from "../i18n/LocaleContext";
import { TextAreaField } from "../editor/TextAreaField";
import { SkillGroups } from "./SkillGroups";
import { SidebarSections } from "./SidebarSections";
import { EntrySections } from "./EntrySections";

export function CvEditor() {
  const { cv } = useApp();
  const dispatch = useAppDispatch();
  const t = useT();

  return (
    <div className="editor">
      <section className="editor-section">
        <h2>{t("cv.section.profile")}</h2>
        <TextAreaField
          label={t("cv.field.profile")}
          value={cv.profile}
          placeholder={t("cv.field.profile.placeholder")}
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
