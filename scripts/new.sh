printf -v day "%02d" $1
mkdir -p ./src/solutions
mkdir -p ./src/solutions/aoc-$day
cat ./src/templates/aoc-XX/index.ts > ./src/solutions/aoc-$day/index.ts
sed -i '' -e "s/{{day}}/$day/" ./src/solutions/aoc-$day/index.ts
touch ./src/solutions/aoc-$day/test.txt
touch ./src/solutions/aoc-$day/data.txt
