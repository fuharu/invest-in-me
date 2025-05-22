type Props = {
    formData: any;
    setFormData: (data: any) => void;
    nextStep: () => void;
  };
  export default function StepProfile({ formData, setFormData, nextStep }: Props) {
    return (
      <form onSubmit={e => { e.preventDefault(); nextStep(); }}>
        <div className="mb-4">
          <label className="block mb-1">学校名</label>
          <input className="border rounded w-full p-2" value={formData.school} onChange={e => setFormData({ ...formData, school: e.target.value })} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">学部</label>
          <input className="border rounded w-full p-2" value={formData.faculty} onChange={e => setFormData({ ...formData, faculty: e.target.value })} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">GPA</label>
          <input className="border rounded w-full p-2" value={formData.gpa} onChange={e => setFormData({ ...formData, gpa: e.target.value })} required />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">次へ</button>
      </form>
    );
  }