import requests

# Test the simplified API
def test_api():
    try:
        response = requests.get("http://localhost:8000/audio-files")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Found {data['count']} audio files")
            
            # Show first few files
            for file in data['audio_files'][:3]:
                print(f"- {file['title']}: {file['url'][:50]}...")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Connection error: {e}")
        print("Make sure FastAPI server is running!")

if __name__ == "__main__":
    test_api()
