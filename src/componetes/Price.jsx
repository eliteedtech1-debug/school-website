import SEO from "../components/SEO";
import { useWebsiteContent } from "../lib/useWebsiteContent";
import { Skeleton, CardSkeleton } from "../components/Skeleton";

export default function Price() {
    const { getSection, getParagraphs, loading } = useWebsiteContent();
    
    const parseStructured = (key) => {
        const section = getSection(key);
        if (!section) return [];
        const paragraphs = typeof section.paragraphs === 'string'
            ? JSON.parse(section.paragraphs)
            : (section.paragraphs || []);
        return paragraphs.map(p => {
            try { return { ...JSON.parse(p.text), _id: p.id }; }
            catch { return null; }
        }).filter(Boolean);
    };

    const pricingHero = getSection('pricing_hero');
    const pricingTiers = parseStructured('pricing_tiers');
    const paymentPlans = parseStructured('pricing_payment_plans');

    const tables = pricingTiers.length > 0
      ? pricingTiers.map(p => ({
          grade: p.grade,
          type: p.program_type || p.type || '',
          statuss: p.status || p.statuss || 'In Take',
          boys: p.boys_fee || p.boys || '—',
          girls: p.girls_fee || p.girls || '—',
        }))
      : []

    return (
        <>
            <SEO
                title="School Fees"
                description="View our school fees schedule for all grade levels. Affordable quality education."
                keywords="school fees, tuition, school fees schedule"
                canonicalPath="/price"
            />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 pt-24 px-4">
            <div className="max-w-7xl mx-auto ">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                        {pricingHero?.title || 'Tuition and Fees'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        {getParagraphs('pricing_hero')[0]?.text || 'Transparent fee structure for all grade levels'}
                    </p>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-900/20 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-blue-950 dark:bg-yellow-400">
                                <tr>
                                    <th className="py-4 px-6 text-left font-semibold text-white dark:text-blue-950">
                                        Grade Level
                                    </th>
                                    <th className="py-4 px-6 text-left font-semibold text-white dark:text-blue-950">
                                        Program Type
                                    </th>
                                    <th className="py-4 px-6 text-left font-semibold text-white dark:text-blue-950">
                                        Status
                                    </th>
                                    <th className="py-4 px-6 text-left font-semibold text-white dark:text-blue-950">
                                        Boys Fee
                                    </th>
                                    <th className="py-4 px-6 text-left font-semibold text-white dark:text-blue-950">
                                        Girls Fee
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tables.map((table, index) => (
                                    <tr 
                                        key={index} 
                                        className={`
                                            border-b border-gray-100 dark:border-gray-700
                                            ${index % 2 === 0 
                                                ? 'bg-white dark:bg-gray-800' 
                                                : 'bg-gray-50 dark:bg-gray-800/50'
                                            }
                                            
                                            transition-colors duration-150
                                        `}
                                    >
                                        <td className="py-4 px-6 text-gray-800 dark:text-gray-200 font-medium">
                                            {table.grade}
                                        </td>
                                        <td className="py-4 px-6 text-gray-700 dark:text-gray-300">
                                            {table.type}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`
                                                px-3 py-1 rounded-full text-xs font-medium
                                                ${table.statuss === "In Take" 
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                    : "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
                                                }
                                            `}>
                                                {table.statuss}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-800 dark:text-gray-200 font-semibold">
                                            {table.boys}
                                        </td>
                                        <td className="py-4 px-6 text-gray-800 dark:text-gray-200 font-semibold">
                                            {table.girls}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                *All fees are annual. Payment plans available upon request.
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">In Take - Accepting New Students</span>
                                <div className="w-3 h-3 rounded-full bg-blue-500 ml-4"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Running - Current Students</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 grid md:grid-cols-3 gap-6 mb-8">
                    {paymentPlans.length > 0 ? paymentPlans.map((plan, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">{plan.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">{plan.description}</p>
                        </div>
                    )) : null}
                </div>
            </div>
        </div></>
    )
}