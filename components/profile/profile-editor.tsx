"use client";

import { useMemo, useState, useTransition } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Briefcase01Icon,
  Certificate01Icon,
  Delete02Icon,
  Mortarboard02Icon,
  ComputerProgramming01Icon,
  Tick02Icon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileCompletenessCard } from "@/components/profile/profile-completeness-card";
import { Textarea } from "@/components/ui/textarea";
import {
  emptyResumeProfile,
  type CertificationItem,
  type EducationItem,
  type ParsedResumeProfile,
  type ProjectItem,
  type ResumeLink,
  type WorkExperience,
} from "@/lib/resume-profile";

type ProfileEditorProps = {
  initialProfile: ParsedResumeProfile;
};

function linesToArray(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function arrayToLines(value: string[]) {
  return value.join("\n");
}

export function ProfileEditor({ initialProfile }: ProfileEditorProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const progress = useMemo(() => {
    const fields = [
      profile.fullName,
      profile.email,
      profile.phone,
      profile.location,
      profile.headline,
      profile.professionalSummary,
      profile.skills.length > 0,
      profile.workExperience.length > 0,
      profile.education.length > 0,
      profile.projects.length > 0,
      profile.certifications.length > 0,
      profile.links.length > 0,
      profile.additionalDetails.length > 0,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [profile]);

  function update<K extends keyof ParsedResumeProfile>(key: K, value: ParsedResumeProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function updateListItem<T>(key: keyof ParsedResumeProfile, index: number, value: T) {
    setProfile((current) => {
      const list = [...(current[key] as T[])];
      list[index] = value;
      return { ...current, [key]: list };
    });
  }

  function removeListItem(key: keyof ParsedResumeProfile, index: number) {
    setProfile((current) => ({
      ...current,
      [key]: (current[key] as unknown[]).filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function addListItem<T>(key: keyof ParsedResumeProfile, value: T) {
    setProfile((current) => ({
      ...current,
      [key]: [...(current[key] as T[]), value],
    }));
  }

  function saveProfile() {
    setMessage("");
    setError("");
    startTransition(async () => {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.error || "Could not save profile.");
        return;
      }

      setMessage("Profile saved.");
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Review and edit the details extracted from your resume.
          </p>
        </div>
        <Button onClick={saveProfile} disabled={isPending}>
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-4" />
          {isPending ? "Saving..." : "Save profile"}
        </Button>
      </div>

      {(message || error) && (
        <p className={error ? "rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive" : "rounded-md bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300"}>
          {error || message}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
        <ProfileCompletenessCard
          progress={progress}
          contactCount={[profile.fullName, profile.email, profile.phone, profile.location].filter(Boolean).length}
          experienceCount={profile.workExperience.length}
          educationCount={profile.education.length}
          projectCount={profile.projects.length}
          extraCount={profile.certifications.length + profile.links.length + profile.additionalDetails.length}
        />

        <Card>
          <CardHeader>
            <CardTitle>Profile sections</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="mb-4 w-full justify-start overflow-x-auto">
                <TabsTrigger value="basic" className="gap-2">
                  <HugeiconsIcon icon={User02Icon} strokeWidth={2} className="size-3.5" />
                  Basic
                </TabsTrigger>
                <TabsTrigger value="experience" className="gap-2">
                  <HugeiconsIcon icon={Briefcase01Icon} strokeWidth={2} className="size-3.5" />
                  Experience
                </TabsTrigger>
                <TabsTrigger value="education" className="gap-2">
                  <HugeiconsIcon icon={Mortarboard02Icon} strokeWidth={2} className="size-3.5" />
                  Education
                </TabsTrigger>
                <TabsTrigger value="projects" className="gap-2">
                  <HugeiconsIcon icon={ComputerProgramming01Icon} strokeWidth={2} className="size-3.5" />
                  Projects
                </TabsTrigger>
                <TabsTrigger value="extra" className="gap-2">
                  <HugeiconsIcon icon={Certificate01Icon} strokeWidth={2} className="size-3.5" />
                  Extra
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="flex flex-col gap-3">
                <FieldGroup className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>Full name</FieldLabel>
                    <Input value={profile.fullName} onChange={(event) => update("fullName", event.target.value)} />
                  </Field>
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input value={profile.email} onChange={(event) => update("email", event.target.value)} />
                  </Field>
                  <Field>
                    <FieldLabel>Phone</FieldLabel>
                    <Input value={profile.phone} onChange={(event) => update("phone", event.target.value)} />
                  </Field>
                  <Field>
                    <FieldLabel>Location</FieldLabel>
                    <Input value={profile.location} onChange={(event) => update("location", event.target.value)} />
                  </Field>
                  <Field className="md:col-span-2">
                    <FieldLabel>Headline</FieldLabel>
                    <Input value={profile.headline} onChange={(event) => update("headline", event.target.value)} />
                  </Field>
                  <Field className="md:col-span-2">
                    <FieldLabel>Professional summary</FieldLabel>
                    <Textarea value={profile.professionalSummary} onChange={(event) => update("professionalSummary", event.target.value)} />
                  </Field>
                  <Field className="md:col-span-2">
                    <FieldLabel>Skills</FieldLabel>
                    <Textarea value={profile.skills.join(", ")} onChange={(event) => update("skills", event.target.value.split(",").map((skill) => skill.trim()).filter(Boolean))} />
                  </Field>
                </FieldGroup>
              </TabsContent>

              <TabsContent value="experience" className="flex flex-col gap-3">
                <div className="flex justify-end">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    onClick={() => addListItem<WorkExperience>("workExperience", { company: "", title: "", duration: "", responsibilities: [] })}
                  >
                    <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-3" />
                    Add work item
                  </Button>
                </div>
                {profile.workExperience.map((item, index) => (
                  <div key={index} className="rounded-md border p-3">
                    <div className="mb-3 flex justify-end">
                      <Button variant="destructive" size="icon-sm" onClick={() => removeListItem("workExperience", index)}>
                        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-3" />
                      </Button>
                    </div>
                    <FieldGroup className="grid gap-3 md:grid-cols-3">
                      <Field><FieldLabel>Company</FieldLabel><Input value={item.company} onChange={(event) => updateListItem("workExperience", index, { ...item, company: event.target.value })} /></Field>
                      <Field><FieldLabel>Job title</FieldLabel><Input value={item.title} onChange={(event) => updateListItem("workExperience", index, { ...item, title: event.target.value })} /></Field>
                      <Field><FieldLabel>Duration</FieldLabel><Input value={item.duration} onChange={(event) => updateListItem("workExperience", index, { ...item, duration: event.target.value })} /></Field>
                      <Field className="md:col-span-3"><FieldLabel>Responsibilities</FieldLabel><Textarea value={arrayToLines(item.responsibilities)} onChange={(event) => updateListItem("workExperience", index, { ...item, responsibilities: linesToArray(event.target.value) })} /></Field>
                    </FieldGroup>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="education" className="flex flex-col gap-3">
                <div className="flex justify-end">
                  <Button variant="default" size="sm" className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" onClick={() => addListItem<EducationItem>("education", { institution: "", degree: "", duration: "", details: [] })}>
                    <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-3" />
                    Add education
                  </Button>
                </div>
                {profile.education.map((item, index) => (
                  <div key={index} className="rounded-md border p-3">
                    <div className="mb-3 flex justify-end"><Button variant="destructive" size="icon-sm" onClick={() => removeListItem("education", index)}><HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-3" /></Button></div>
                    <FieldGroup className="grid gap-3 md:grid-cols-3">
                      <Field><FieldLabel>Institution</FieldLabel><Input value={item.institution} onChange={(event) => updateListItem("education", index, { ...item, institution: event.target.value })} /></Field>
                      <Field><FieldLabel>Degree</FieldLabel><Input value={item.degree} onChange={(event) => updateListItem("education", index, { ...item, degree: event.target.value })} /></Field>
                      <Field><FieldLabel>Duration</FieldLabel><Input value={item.duration} onChange={(event) => updateListItem("education", index, { ...item, duration: event.target.value })} /></Field>
                      <Field className="md:col-span-3"><FieldLabel>Details</FieldLabel><Textarea value={arrayToLines(item.details)} onChange={(event) => updateListItem("education", index, { ...item, details: linesToArray(event.target.value) })} /></Field>
                    </FieldGroup>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="projects" className="flex flex-col gap-3">
                <div className="flex justify-end">
                  <Button variant="default" size="sm" className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" onClick={() => addListItem<ProjectItem>("projects", { name: "", description: "", technologies: [], links: [] })}>
                    <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-3" />
                    Add project
                  </Button>
                </div>
                {profile.projects.map((item, index) => (
                  <div key={index} className="rounded-md border p-3">
                    <div className="mb-3 flex justify-end"><Button variant="destructive" size="icon-sm" onClick={() => removeListItem("projects", index)}><HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-3" /></Button></div>
                    <FieldGroup>
                      <Field><FieldLabel>Name</FieldLabel><Input value={item.name} onChange={(event) => updateListItem("projects", index, { ...item, name: event.target.value })} /></Field>
                      <Field><FieldLabel>Description</FieldLabel><Textarea value={item.description} onChange={(event) => updateListItem("projects", index, { ...item, description: event.target.value })} /></Field>
                      <Field><FieldLabel>Technologies</FieldLabel><Input value={item.technologies.join(", ")} onChange={(event) => updateListItem("projects", index, { ...item, technologies: event.target.value.split(",").map((tech) => tech.trim()).filter(Boolean) })} /></Field>
                      <Field><FieldLabel>Links</FieldLabel><Textarea value={arrayToLines(item.links)} onChange={(event) => updateListItem("projects", index, { ...item, links: linesToArray(event.target.value) })} /></Field>
                    </FieldGroup>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="extra" className="flex flex-col gap-3">
                <div className="flex justify-end">
                  <Button variant="default" size="sm" className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" onClick={() => addListItem<CertificationItem>("certifications", { name: "", issuer: "", date: "", link: "" })}>
                    <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-3" />
                    Add certification
                  </Button>
                </div>
                {profile.certifications.map((item, index) => (
                  <div key={index} className="rounded-md border p-3">
                    <div className="mb-3 flex justify-end"><Button variant="destructive" size="icon-sm" onClick={() => removeListItem("certifications", index)}><HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-3" /></Button></div>
                    <FieldGroup className="grid gap-3 md:grid-cols-2">
                      <Field><FieldLabel>Name</FieldLabel><Input value={item.name} onChange={(event) => updateListItem("certifications", index, { ...item, name: event.target.value })} /></Field>
                      <Field><FieldLabel>Issuer</FieldLabel><Input value={item.issuer} onChange={(event) => updateListItem("certifications", index, { ...item, issuer: event.target.value })} /></Field>
                      <Field><FieldLabel>Date</FieldLabel><Input value={item.date} onChange={(event) => updateListItem("certifications", index, { ...item, date: event.target.value })} /></Field>
                      <Field><FieldLabel>Link</FieldLabel><Input value={item.link} onChange={(event) => updateListItem("certifications", index, { ...item, link: event.target.value })} /></Field>
                    </FieldGroup>
                  </div>
                ))}
                <Field>
                  <FieldLabel>Profile links</FieldLabel>
                  <Textarea
                    value={profile.links.map((link) => `${link.label}: ${link.url}`).join("\n")}
                    onChange={(event) => {
                      const links: ResumeLink[] = linesToArray(event.target.value).map((line) => {
                        const [label, ...urlParts] = line.split(":");
                        return { label: label.trim(), url: urlParts.join(":").trim() };
                      });
                      update("links", links);
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel>Additional details</FieldLabel>
                  <Textarea
                    value={arrayToLines(profile.additionalDetails)}
                    onChange={(event) => update("additionalDetails", linesToArray(event.target.value))}
                  />
                </Field>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const fallbackProfile = emptyResumeProfile;
