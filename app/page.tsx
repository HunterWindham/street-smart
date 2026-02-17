import AddressSearchBox from "@/components/AddressSearchBox"

const Home = () => {
  return (
    <main className="relative flex min-h-[calc(75vh-4rem)] flex-col justify-center px-4 py-8 ">
      <div className="container mx-auto max-w-4xl rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <h2 className="mb-2 text-2xl font-semibold text-center">Location Intelligence</h2>
        <p className="mb-6 text-lg text-gray-400 text-center" data-testid="location-details">
          Get insights for any address or city across the United States.
        </p>
        <AddressSearchBox />
      </div>
    </main>
  )
}

export default Home