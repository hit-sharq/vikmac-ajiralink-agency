"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import styles from "./form.module.css"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  nationality: string
  passportNumber: string
  passportExpiryDate: string
  category: string
  yearsOfExperience: string
  trainingCompleted: boolean
  medicalClearance: boolean
  workExperience: Array<{
    jobTitle: string
    company: string
    country: string
    startDate: string
    endDate: string
    description: string
  }>
  certifications: Array<{
    certName: string
    issuedBy: string
    issueDate: string
    expiryDate: string
  }>
  profilePhoto: File | null
  cv: File | null
  documents: File[]
}

export default function ApplicantForm({ currentStep, setCurrentStep, onDataUpdate }: any) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const careerId = searchParams.get('careerId')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedCareer, setSelectedCareer] = useState<any>(null)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    passportNumber: "",
    passportExpiryDate: "",
    category: "nanny",
    yearsOfExperience: "0",
    trainingCompleted: false,
    medicalClearance: false,
    workExperience: [{ jobTitle: "", company: "", country: "", startDate: "", endDate: "", description: "" }],
    certifications: [{ certName: "", issuedBy: "", issueDate: "", expiryDate: "" }],
    profilePhoto: null,
    cv: null,
    documents: [],
  })

  // Fetch career details if careerId is provided
  useEffect(() => {
    if (careerId) {
      fetch(`/api/careers/${careerId}`)
        .then(response => response.json())
        .then(data => {
          setSelectedCareer(data)
          // Pre-fill category based on career type if available
          if (data.category) {
            setFormData(prev => ({ ...prev, category: data.category }))
          }
        })
        .catch(error => {
          console.error("Failed to fetch career details:", error)
        })
    }
  }, [careerId])

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleFileChange = (e: any, fieldName: string) => {
    const files = e.target.files
    if (fieldName === "documents") {
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...(Array.from(files) as File[])],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: files?.[0] || null,
      }))
    }
  }

  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        { jobTitle: "", company: "", country: "", startDate: "", endDate: "", description: "" },
      ],
    }))
  }

  const updateWorkExperience = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.workExperience]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, workExperience: updated }
    })
  }

  const removeWorkExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }))
  }

  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { certName: "", issuedBy: "", issueDate: "", expiryDate: "" }],
    }))
  }

  const updateCertification = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.certifications]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, certifications: updated }
    })
  }

  const removeCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Upload files to storage and then submit form
      const submitData = {
        ...formData,
        yearsOfExperience: Number.parseInt(formData.yearsOfExperience),
      }

      const response = await fetch("/api/applicants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        throw new Error("Failed to register applicant")
      }

      const result = await response.json()
      onDataUpdate(result)
      router.push(`/applicant-dashboard/${result.id}`)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      {selectedCareer && (
        <div className={styles.careerInfo}>
          <h3>Applying for: {selectedCareer.title}</h3>
          <p><strong>Company:</strong> {selectedCareer.company}</p>
          {selectedCareer.location && <p><strong>Location:</strong> {selectedCareer.location}</p>}
          {selectedCareer.salary && <p><strong>Salary:</strong> {selectedCareer.salary}</p>}
          {selectedCareer.commission && <p><strong>Commission:</strong> {selectedCareer.commission}%</p>}
        </div>
      )}

      {currentStep === 0 && (
        <div className={styles.formStep}>
          <h2>Personal Information</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>First Name *</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Last Name *</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Phone *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Nationality *</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Profile Photo</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "profilePhoto")} />
            </div>
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className={styles.formStep}>
          <h2>Passport & Documentation</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Passport Number *</label>
              <input
                type="text"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Passport Expiry Date *</label>
              <input
                type="date"
                name="passportExpiryDate"
                value={formData.passportExpiryDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Upload CV</label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, "cv")} />
          </div>
          <div className={styles.formGroup}>
            <label>Upload Additional Documents</label>
            <input type="file" multiple onChange={(e) => handleFileChange(e, "documents")} />
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className={styles.formStep}>
          <h2>Work Information</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleInputChange} required>
                <option value="nanny">Nanny</option>
                <option value="driver">Driver</option>
                <option value="cleaner">Cleaner</option>
                <option value="security">Security</option>
                <option value="cook">Cook</option>
                <option value="nurse">Nurse</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Years of Experience *</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3>Work Experience</h3>
            {formData.workExperience.map((exp, index) => (
              <div key={index} className={styles.experienceBlock}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Job Title</label>
                    <input
                      type="text"
                      value={exp.jobTitle}
                      onChange={(e) => updateWorkExperience(index, "jobTitle", e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Country</label>
                    <input
                      type="text"
                      value={exp.country}
                      onChange={(e) => updateWorkExperience(index, "country", e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => updateWorkExperience(index, "startDate", e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>End Date</label>
                    <input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => updateWorkExperience(index, "endDate", e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateWorkExperience(index, "description", e.target.value)}
                  />
                </div>
                {formData.workExperience.length > 1 && (
                  <button type="button" onClick={() => removeWorkExperience(index)} className={styles.removeBtn}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addWorkExperience} className={styles.addBtn}>
              + Add Work Experience
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className={styles.formStep}>
          <h2>Certifications & Training</h2>
          <div className={styles.section}>
            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  name="trainingCompleted"
                  checked={formData.trainingCompleted}
                  onChange={handleInputChange}
                />
                Training Completed
              </label>
            </div>
            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  name="medicalClearance"
                  checked={formData.medicalClearance}
                  onChange={handleInputChange}
                />
                Medical Clearance Obtained
              </label>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Certifications</h3>
            {formData.certifications.map((cert, index) => (
              <div key={index} className={styles.experienceBlock}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Certification Name</label>
                    <input
                      type="text"
                      value={cert.certName}
                      onChange={(e) => updateCertification(index, "certName", e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Issued By</label>
                    <input
                      type="text"
                      value={cert.issuedBy}
                      onChange={(e) => updateCertification(index, "issuedBy", e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Issue Date</label>
                    <input
                      type="date"
                      value={cert.issueDate}
                      onChange={(e) => updateCertification(index, "issueDate", e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Expiry Date</label>
                    <input
                      type="date"
                      value={cert.expiryDate}
                      onChange={(e) => updateCertification(index, "expiryDate", e.target.value)}
                    />
                  </div>
                </div>
                {formData.certifications.length > 1 && (
                  <button type="button" onClick={() => removeCertification(index)} className={styles.removeBtn}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addCertification} className={styles.addBtn}>
              + Add Certification
            </button>
          </div>
        </div>
      )}

      <div className={styles.navigation}>
        <button
          type="button"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className={styles.prevBtn}
        >
          Previous
        </button>
        <span className={styles.stepCounter}>Step {currentStep + 1} of 4</span>
        {currentStep < 3 ? (
          <button type="button" onClick={() => setCurrentStep(currentStep + 1)} className={styles.nextBtn}>
            Next
          </button>
        ) : (
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "Submitting..." : "Complete Registration"}
          </button>
        )}
      </div>
    </form>
  )
}
